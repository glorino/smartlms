"use client";

import { useState } from "react";
import {
  Settings,
  Mail,
  CreditCard,
  Key,
  ToggleLeft,
  Save,
  Globe,
  Palette,
  Bell,
  Shield,
  Users,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
}

interface PaymentSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
  currency: string;
  commissionRate: number;
}

interface FeatureToggles {
  enableChat: boolean;
  enableLiveClasses: boolean;
  enableQuizzes: boolean;
  enableCertificates: boolean;
  enableAI: boolean;
  enableDarkMode: boolean;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");
  const [platform, setPlatform] = useState<PlatformSettings>({
    siteName: "SmartLMS",
    siteDescription: "AI-Powered Learning Management System",
    siteUrl: "https://smartlms.vercel.app",
    logo: "",
  });
  const [email, setEmail] = useState<EmailSettings>({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    fromName: "SmartLMS",
    fromEmail: "noreply@smartlms.com",
  });
  const [payment, setPayment] = useState<PaymentSettings>({
    stripePublicKey: "",
    stripeSecretKey: "",
    currency: "USD",
    commissionRate: 10,
  });
  const [features, setFeatures] = useState<FeatureToggles>({
    enableChat: true,
    enableLiveClasses: true,
    enableQuizzes: true,
    enableCertificates: true,
    enableAI: true,
    enableDarkMode: false,
    maintenanceMode: false,
  });
  const [apiKeys, setApiKeys] = useState({
    openaiKey: "",
    googleClientId: "",
    githubClientId: "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, email, payment, features, apiKeys }),
      });
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "platform", label: "Platform", icon: Globe },
    { id: "email", label: "Email", icon: Mail },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "api", label: "API Keys", icon: Key },
    { id: "features", label: "Features", icon: ToggleLeft },
  ];

  const featureList = [
    { key: "enableChat" as const, label: "Live Chat", description: "Enable real-time chat between users" },
    { key: "enableLiveClasses" as const, label: "Live Classes", description: "Allow instructors to host live classes" },
    { key: "enableQuizzes" as const, label: "Quizzes", description: "Enable quiz creation and attempts" },
    { key: "enableCertificates" as const, label: "Certificates", description: "Auto-generate certificates on completion" },
    { key: "enableAI" as const, label: "AI Features", description: "Enable AI-powered content generation" },
    { key: "enableDarkMode" as const, label: "Dark Mode", description: "Allow users to switch to dark mode" },
    { key: "maintenanceMode" as const, label: "Maintenance Mode", description: "Put the platform in maintenance mode" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="mt-1 text-gray-500">Configure platform settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Platform Settings */}
      {activeTab === "platform" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={platform.siteName}
                onChange={(e) => setPlatform({ ...platform, siteName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                value={platform.siteDescription}
                onChange={(e) => setPlatform({ ...platform, siteDescription: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <input
                type="url"
                value={platform.siteUrl}
                onChange={(e) => setPlatform({ ...platform, siteUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={platform.logo}
                onChange={(e) => setPlatform({ ...platform, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Settings */}
      {activeTab === "email" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={email.smtpHost}
                  onChange={(e) => setEmail({ ...email, smtpHost: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="text"
                  value={email.smtpPort}
                  onChange={(e) => setEmail({ ...email, smtpPort: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
              <input
                type="text"
                value={email.smtpUser}
                onChange={(e) => setEmail({ ...email, smtpUser: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
              <input
                type="password"
                value={email.smtpPass}
                onChange={(e) => setEmail({ ...email, smtpPass: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input
                  type="text"
                  value={email.fromName}
                  onChange={(e) => setEmail({ ...email, fromName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input
                  type="email"
                  value={email.fromEmail}
                  onChange={(e) => setEmail({ ...email, fromEmail: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Settings */}
      {activeTab === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Public Key</label>
              <input
                type="text"
                value={payment.stripePublicKey}
                onChange={(e) => setPayment({ ...payment, stripePublicKey: e.target.value })}
                placeholder="pk_test_..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
              <input
                type="password"
                value={payment.stripeSecretKey}
                onChange={(e) => setPayment({ ...payment, stripeSecretKey: e.target.value })}
                placeholder="sk_test_..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={payment.currency}
                  onChange={(e) => setPayment({ ...payment, currency: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  value={payment.commissionRate}
                  onChange={(e) => setPayment({ ...payment, commissionRate: Number(e.target.value) })}
                  min={0}
                  max={50}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys */}
      {activeTab === "api" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={apiKeys.openaiKey}
                onChange={(e) => setApiKeys({ ...apiKeys, openaiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Client ID</label>
              <input
                type="text"
                value={apiKeys.googleClientId}
                onChange={(e) => setApiKeys({ ...apiKeys, googleClientId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Client ID</label>
              <input
                type="text"
                value={apiKeys.githubClientId}
                onChange={(e) => setApiKeys({ ...apiKeys, githubClientId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Toggles */}
      {activeTab === "features" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ToggleLeft className="h-5 w-5" />
              Feature Toggles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureList.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{feature.label}</p>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setFeatures({ ...features, [feature.key]: !features[feature.key] })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      features[feature.key] ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                        features[feature.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
