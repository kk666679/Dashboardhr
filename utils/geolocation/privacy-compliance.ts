// Privacy and Legal Compliance for Geolocation Tracking

export interface ConsentRecord {
  workerId: string;
  consentType: "location_tracking" | "emergency_contact" | "data_sharing";
  granted: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  witnessId?: string;
  expiryDate?: string;
}

export interface PrivacySettings {
  dataRetentionDays: number;
  anonymizeAfterDays: number;
  shareWithAuthorities: boolean;
  shareWithEmployer: boolean;
  emergencyContactsOnly: boolean;
  trackingFrequency: "high" | "medium" | "low";
}

export class PrivacyCompliance {
  // PDPA Compliance - Malaysia Personal Data Protection Act
  static validateConsent(consent: ConsentRecord): boolean {
    if (!consent.granted || !consent.timestamp) return false;

    // Check if consent is still valid (max 2 years for location data)
    const consentDate = new Date(consent.timestamp);
    const maxAge = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years in milliseconds

    return Date.now() - consentDate.getTime() < maxAge;
  }

  static generateConsentForm(
    workerId: string,
    language: string = "en",
  ): string {
    const translations = {
      en: {
        title: "Location Tracking Consent",
        purpose: "Your location data will be used for:",
        purposes: [
          "Workplace safety and emergency response",
          "Attendance verification at authorized work sites",
          "Compliance with Malaysian labor laws and regulations",
          "Preventing unauthorized work location violations",
        ],
        rights:
          "Your rights under Malaysia's Personal Data Protection Act (PDPA):",
        rightsList: [
          "Right to access your location data",
          "Right to correct inaccurate data",
          "Right to withdraw consent at any time",
          "Right to limit data processing",
          "Right to data portability",
        ],
        retention:
          "Data will be retained for 7 years as required by Malaysian labor law, then anonymized.",
        contact: "For privacy concerns, contact: privacy@company.com",
      },
      ms: {
        title: "Persetujuan Penjejakan Lokasi",
        purpose: "Data lokasi anda akan digunakan untuk:",
        purposes: [
          "Keselamatan tempat kerja dan tindak balas kecemasan",
          "Pengesahan kehadiran di tapak kerja yang dibenarkan",
          "Pematuhan undang-undang buruh Malaysia",
          "Mencegah pelanggaran lokasi kerja yang tidak dibenarkan",
        ],
      },
    };

    return JSON.stringify(
      translations[language as keyof typeof translations] || translations.en,
    );
  }

  // Data minimization - only collect necessary location data
  static minimizeLocationData(location: any): any {
    return {
      latitude: Math.round(location.latitude * 10000) / 10000, // 4 decimal places (~11m accuracy)
      longitude: Math.round(location.longitude * 10000) / 10000,
      timestamp: location.timestamp,
      accuracy: location.accuracy > 100 ? ">100m" : "precise",
    };
  }

  // Anonymize location data after retention period
  static anonymizeLocationData(location: any): any {
    return {
      ...location,
      workerId: "ANONYMIZED",
      latitude: Math.round(location.latitude * 100) / 100, // Reduce precision
      longitude: Math.round(location.longitude * 100) / 100,
      address: undefined,
    };
  }

  // Check if data sharing is compliant with Malaysian laws
  static validateDataSharing(purpose: string, recipient: string): boolean {
    const allowedPurposes = [
      "emergency_response",
      "labor_compliance",
      "immigration_enforcement",
      "workplace_safety",
    ];

    const allowedRecipients = [
      "emergency_services",
      "jtk_malaysia", // Department of Labour
      "immigration_malaysia",
      "employer_hr",
      "safety_officer",
    ];

    return (
      allowedPurposes.includes(purpose) && allowedRecipients.includes(recipient)
    );
  }

  // Generate audit trail for compliance
  static createAuditLog(action: string, workerId: string, data: any): any {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      workerId,
      dataAccessed: Object.keys(data),
      legalBasis: "legitimate_interest_safety",
      retentionPeriod: "7_years",
      complianceFramework: "PDPA_Malaysia",
    };
  }
}

// Malaysian Labor Law Compliance
export class LaborLawCompliance {
  // Workers' Minimum Standards of Housing and Amenities Act 1990
  static validateAccommodationTracking(
    location: any,
    accommodationZones: any[],
  ): boolean {
    // Ensure workers are not tracked in private accommodation areas
    const privateZones = accommodationZones.filter(
      (zone) => zone.type === "private_quarters",
    );

    return !privateZones.some((zone) => this.isLocationInZone(location, zone));
  }

  // Employment Act 1955 - Working hours compliance
  static validateWorkingHoursTracking(
    location: any,
    workSchedule: any,
  ): boolean {
    const currentHour = new Date().getHours();
    const isWorkingHours =
      currentHour >= workSchedule.startHour &&
      currentHour <= workSchedule.endHour;

    // Only track during working hours unless emergency
    return isWorkingHours || location.isEmergency;
  }

  private static isLocationInZone(location: any, zone: any): boolean {
    // Simple point-in-polygon check
    const { latitude, longitude } = location;
    const { coordinates } = zone;

    let inside = false;
    for (
      let i = 0, j = coordinates.length - 1;
      i < coordinates.length;
      j = i++
    ) {
      if (
        coordinates[i].longitude > longitude !==
          coordinates[j].longitude > longitude &&
        latitude <
          ((coordinates[j].latitude - coordinates[i].latitude) *
            (longitude - coordinates[i].longitude)) /
            (coordinates[j].longitude - coordinates[i].longitude) +
            coordinates[i].latitude
      ) {
        inside = !inside;
      }
    }
    return inside;
  }
}

// Immigration Act Compliance
export class ImmigrationCompliance {
  static validateLocationForPermit(
    location: any,
    workPermit: any,
  ): {
    isValid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    // Check if location is within permitted state
    if (
      workPermit.permittedStates &&
      !workPermit.permittedStates.includes(location.state)
    ) {
      violations.push("Location outside permitted state");
    }

    // Check if location is within permitted sector zones
    if (workPermit.sectorRestrictions) {
      const allowedZones = workPermit.sectorRestrictions.allowedZones || [];
      const isInAllowedZone = allowedZones.some((zone: any) =>
        LaborLawCompliance["isLocationInZone"](location, zone),
      );

      if (!isInAllowedZone) {
        violations.push("Location outside permitted work sector");
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  // Generate compliance report for authorities
  static generateComplianceReport(
    workerId: string,
    period: { start: string; end: string },
  ): any {
    return {
      workerId,
      reportPeriod: period,
      complianceStatus: "compliant",
      locationVerifications: [],
      violations: [],
      generatedAt: new Date().toISOString(),
      reportingOfficer: "system_automated",
    };
  }
}
