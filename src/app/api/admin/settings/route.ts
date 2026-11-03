import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { invalidateSettingsCache } from "@/lib/settings";
import { encrypt, isEncrypted } from "@/lib/crypto";

// Value returned to the browser instead of real secrets. The admin UI
// treats it as an unchanged value on save, so the stored secret is kept.
const SECRET_MASK = "••••••••";

// Secret fields per settings section (the section key stored in the DB).
// Both the flutterwave* names used by the admin UI and the flw* aliases
// accepted by getSettings() are covered.
const SENSITIVE_FIELDS: Record<string, string[]> = {
  email: ["smtpPass"],
  payment: [
    "flutterwaveSecretKey",
    "flwSecretKey",
    "flutterwaveEncryptionKey",
    "flwEncryptionKey",
  ],
  apiKeys: ["openaiKey"],
};

// Replaces secret values with the mask so they never reach the browser.
function maskSettings(settingsMap: Record<string, any>): Record<string, any> {
  const masked: Record<string, any> = { ...settingsMap };
  for (const [sectionName, fields] of Object.entries(SENSITIVE_FIELDS)) {
    const section = masked[sectionName];
    if (!section || typeof section !== "object") continue;
    const maskedSection = { ...section };
    for (const field of fields) {
      const value = maskedSection[field];
      if (typeof value === "string" && value) {
        maskedSection[field] = SECRET_MASK;
      }
    }
    masked[sectionName] = maskedSection;
  }
  return masked;
}

// Prepares settings for storage: secrets are encrypted, and values left as
// the mask keep whatever is already stored (encrypting legacy plaintext).
function prepareForStorage(
  settings: Record<string, any>,
  existing: Record<string, any>
): Record<string, any> {
  const prepared: Record<string, any> = { ...settings };
  for (const [sectionName, fields] of Object.entries(SENSITIVE_FIELDS)) {
    const section = prepared[sectionName];
    if (!section || typeof section !== "object") continue;

    const existingSection =
      existing[sectionName] && typeof existing[sectionName] === "object"
        ? existing[sectionName]
        : {};
    const next = { ...section };

    for (const field of fields) {
      const value = next[field];
      if (value === SECRET_MASK) {
        // Admin didn't change it: keep the stored secret
        const stored = existingSection[field];
        if (typeof stored === "string" && stored) {
          next[field] = isEncrypted(stored) ? stored : encrypt(stored);
        } else {
          delete next[field];
        }
      } else if (typeof value === "string" && value) {
        next[field] = encrypt(value);
      }
      // Empty string means "cleared" and is stored as-is
    }
    prepared[sectionName] = next;
  }
  return prepared;
}

async function readSettingsMap(): Promise<Record<string, any>> {
  const rows = await prisma.siteSettings.findMany();
  const settingsMap: Record<string, any> = {};
  for (const row of rows) {
    settingsMap[row.key] = row.value;
  }
  return settingsMap;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settingsMap = await readSettingsMap();

    return NextResponse.json({ settings: maskSettings(settingsMap) });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "settings object is required" },
        { status: 400 }
      );
    }

    // Needed to preserve secrets the admin left masked
    const existing = await readSettingsMap();
    const prepared = prepareForStorage(settings, existing);

    const updates = [];
    for (const [key, value] of Object.entries(prepared)) {
      updates.push(
        prisma.siteSettings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      );
    }

    await Promise.all(updates);

    // Make the updated settings take effect immediately for this server
    invalidateSettingsCache();

    const settingsMap = await readSettingsMap();

    return NextResponse.json({ settings: maskSettings(settingsMap) });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
