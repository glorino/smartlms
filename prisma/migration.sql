-- Migration: Add PasswordResetToken, RateLimitEntry, rename stripePaymentId, add indexes
-- Run this in Neon SQL Editor: https://console.neon.tech

-- 1. Create PasswordResetToken table
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- 2. Create RateLimitEntry table
CREATE TABLE IF NOT EXISTS "RateLimitEntry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "timestamps" TEXT[] NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimitEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "RateLimitEntry_key_key" ON "RateLimitEntry"("key");
CREATE INDEX IF NOT EXISTS "RateLimitEntry_key_idx" ON "RateLimitEntry"("key");

-- 3. Rename stripePaymentId to flutterwavePaymentId in Payment table
ALTER TABLE "Payment" RENAME COLUMN "stripePaymentId" TO "flutterwavePaymentId";

-- 4. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "Lesson_courseId_idx" ON "Lesson"("courseId");
CREATE INDEX IF NOT EXISTS "DripContent_lessonId_idx" ON "DripContent"("lessonId");
CREATE INDEX IF NOT EXISTS "AIContentGeneration_lessonId_idx" ON "AIContentGeneration"("lessonId");
CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX IF NOT EXISTS "ActivityLog_action_idx" ON "ActivityLog"("action");
CREATE INDEX IF NOT EXISTS "ActivityLog_entityId_idx" ON "ActivityLog"("entityId");
