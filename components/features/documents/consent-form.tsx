"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, FileText, AlertTriangle } from "lucide-react";
import { useUpdateLocationSettingsMutation } from "@/server/api/geolocation-api";

interface ConsentFormProps {
  workerId: string;
  onConsentGiven: () => void;
}

export function ConsentForm({ workerId, onConsentGiven }: ConsentFormProps) {
  const [language, setLanguage] = useState("en");
  const [consents, setConsents] = useState({
    locationTracking: false,
    emergencyContact: false,
    dataSharing: false,
    privacyPolicy: false,
  });
  const [updateSettings] = useUpdateLocationSettingsMutation();

  const handleConsentChange = (
    type: keyof typeof consents,
    checked: boolean,
  ) => {
    setConsents((prev) => ({ ...prev, [type]: checked }));
  };

  const handleSubmit = async () => {
    if (!Object.values(consents).every(Boolean)) return;

    try {
      await updateSettings({
        workerId,
        settings: {
          trackingEnabled: true,
          consentGiven: true,
          consentDate: new Date().toISOString(),
          emergencyContactsEnabled: consents.emergencyContact,
          privacyLevel: "standard",
        },
      });
      onConsentGiven();
    } catch (error: unknown) {
      console.error("Failed to save consent:", error);
    }
  };

  const translations = {
    en: {
      title: "Location Tracking Consent",
      subtitle: "Please review and consent to location tracking",
      purposes: [
        "Workplace safety and emergency response",
        "Attendance verification at authorized work sites",
        "Compliance with Malaysian labor laws",
        "Preventing unauthorized work location violations",
      ],
      rights: [
        "Access your location data anytime",
        "Correct any inaccurate information",
        "Withdraw consent at any time",
        "Limit how your data is processed",
        "Request data portability",
      ],
      consents: {
        locationTracking: "I consent to location tracking during work hours",
        emergencyContact: "I consent to emergency contact notifications",
        dataSharing:
          "I consent to sharing data with authorities when required by law",
        privacyPolicy: "I have read and agree to the Privacy Policy",
      },
    },
    ms: {
      title: "Persetujuan Penjejakan Lokasi",
      subtitle: "Sila semak dan bersetuju dengan penjejakan lokasi",
      purposes: [
        "Keselamatan tempat kerja dan tindak balas kecemasan",
        "Pengesahan kehadiran di tapak kerja yang dibenarkan",
        "Pematuhan undang-undang buruh Malaysia",
        "Mencegah pelanggaran lokasi kerja",
      ],
      rights: [
        "Akses data lokasi anda bila-bila masa",
        "Betulkan sebarang maklumat yang tidak tepat",
        "Tarik balik persetujuan pada bila-bila masa",
        "Hadkan cara data anda diproses",
        "Minta pemindahan data",
      ],
      consents: {
        locationTracking:
          "Saya bersetuju dengan penjejakan lokasi semasa waktu kerja",
        emergencyContact:
          "Saya bersetuju dengan pemberitahuan hubungan kecemasan",
        dataSharing:
          "Saya bersetuju berkongsi data dengan pihak berkuasa jika diperlukan",
        privacyPolicy: "Saya telah membaca dan bersetuju dengan Dasar Privasi",
      },
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ms">Bahasa Malaysia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Data Usage Purpose</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {t.purposes.map((purpose, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {purpose}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">
            {language === "en"
              ? "Your Rights (PDPA Malaysia)"
              : "Hak Anda (PDPA Malaysia)"}
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            {t.rights.map((right, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                {right}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Required Consents</h4>

          {Object.entries(t.consents).map(([key, label]) => (
            <div key={key} className="flex items-start gap-3">
              <Checkbox
                id={key}
                checked={consents[key as keyof typeof consents]}
                onCheckedChange={(checked) =>
                  handleConsentChange(
                    key as keyof typeof consents,
                    checked as boolean,
                  )
                }
              />
              <label
                htmlFor={key}
                className="text-sm leading-relaxed cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Data Retention</p>
              <p>
                Location data will be retained for 7 years as required by
                Malaysian labor law, then anonymized. You can withdraw consent
                at any time through the app settings.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!Object.values(consents).every(Boolean)}
          className="w-full"
          size="lg"
        >
          <FileText className="h-4 w-4 mr-2" />
          Grant Consent & Enable Tracking
        </Button>
      </CardContent>
    </Card>
  );
}
