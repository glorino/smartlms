import prisma from "@/lib/prisma";

export interface AppSettings {
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  fromName?: string;
  fromEmail?: string;
  flwPublicKey?: string;
  flwSecretKey?: string;
  flwEncryptionKey?: string;
  currency?: string;
  commissionRate?: number;
  openaiKey?: string;
  chatEnabled?: boolean;
  liveClassesEnabled?: boolean;
  quizzesEnabled?: boolean;
  certificatesEnabled?: boolean;
  aiEnabled?: boolean;
  darkModeEnabled?: boolean;
  maintenanceMode?: boolean;
}

let cachedSettings: AppSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 60 seconds

function asObject(value: any): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export async function getSettings(): Promise<AppSettings> {
  if (cachedSettings && Date.now() - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const rows = await prisma.siteSettings.findMany();
    const map: Record<string, any> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }

    const email = asObject(map.email);
    const payment = asObject(map.payment);
    const apiKeys = asObject(map.apiKeys);
    const features = asObject(map.features);

    cachedSettings = {
      smtpHost: email.smtpHost || process.env.SMTP_HOST,
      smtpPort: email.smtpPort || process.env.SMTP_PORT,
      smtpUser: email.smtpUser || process.env.SMTP_USER,
      smtpPass: email.smtpPass || process.env.SMTP_PASS,
      fromName: email.fromName,
      fromEmail: email.fromEmail || process.env.SMTP_FROM,
      // Admin UI stores these as flutterwavePublicKey/SecretKey/EncryptionKey;
      // the flw* aliases are accepted as well.
      flwPublicKey:
        payment.flwPublicKey ||
        payment.flutterwavePublicKey ||
        process.env.NEXT_PUBLIC_FLWPUBK,
      flwSecretKey:
        payment.flwSecretKey ||
        payment.flutterwaveSecretKey ||
        process.env.FLWSECK,
      flwEncryptionKey:
        payment.flwEncryptionKey ||
        payment.flutterwaveEncryptionKey ||
        process.env.FLW_ENCRYPTION_KEY,
      currency: payment.currency || "NGN",
      commissionRate: Number(payment.commissionRate) || 0,
      openaiKey: apiKeys.openaiKey || process.env.OPENAI_API_KEY,
      // Admin UI stores these as enable*; the *Enabled aliases are accepted too.
      chatEnabled: features.enableChat ?? features.chatEnabled ?? true,
      liveClassesEnabled:
        features.enableLiveClasses ?? features.liveClassesEnabled ?? true,
      quizzesEnabled: features.enableQuizzes ?? features.quizzesEnabled ?? true,
      certificatesEnabled:
        features.enableCertificates ?? features.certificatesEnabled ?? true,
      aiEnabled: features.enableAI ?? features.aiEnabled ?? true,
      darkModeEnabled: features.enableDarkMode ?? features.darkModeEnabled ?? true,
      maintenanceMode: features.maintenanceMode ?? false,
    };
    cacheTime = Date.now();
    return cachedSettings;
  } catch {
    // Fallback to env vars only
    return {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      fromEmail: process.env.SMTP_FROM,
      flwSecretKey: process.env.FLWSECK,
      flwEncryptionKey: process.env.FLW_ENCRYPTION_KEY,
      currency: "NGN",
      openaiKey: process.env.OPENAI_API_KEY,
      chatEnabled: true,
      liveClassesEnabled: true,
      quizzesEnabled: true,
      certificatesEnabled: true,
      aiEnabled: true,
      darkModeEnabled: true,
      maintenanceMode: false,
    };
  }
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
