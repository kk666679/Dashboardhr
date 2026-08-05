/**
 * Privacy compliance utilities for geolocation data
 * Implements data minimization and anonymization for GDPR/PDMA compliance
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  isEmergency?: boolean;
  state?: string;
  sector?: string;
}

export interface ConsentRecord {
  consentType: "location_tracking" | "emergency_contact" | "data_sharing";
  granted: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  witnessId?: string;
  expiryDate?: string;
}

export interface Zone {
  coordinates: [[number, number], [number, number]];
  type?: string;
  [key: string]: unknown;
}

export interface WorkSchedule {
  startHour: number;
  endHour: number;
}

export interface WorkPermit {
  permittedStates?: string[];
  sectorRestrictions?: {
    allowedZones?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Verification {
  isCompliant: boolean;
  [key: string]: unknown;
}

export interface ComplianceReport {
  workerId: string;
  period: {
    start: string;
    end: string;
  };
  verifications: Verification[];
  timestamp: string;
  status: "compliant" | "partial" | "non-compliant";
}

export interface AuditLog {
  action: string;
  workerId: string;
  data: unknown;
  timestamp: string;
  dataAccessed: string[];
}

export interface ValidationResult {
  isCompliant: boolean;
  violations: string[];
}

export class PrivacyCompliance {
  static minimizeLocationData(location: LocationData): Partial<LocationData> {
    return {
      latitude: Math.round(location.latitude * 10000) / 10000,
      longitude: Math.round(location.longitude * 10000) / 10000,
      timestamp: location.timestamp,
      accuracy: (location.accuracy && location.accuracy > 100 ? (">100m" as any) : ("precise" as any)) as any,
    };
  }

  static anonymizeLocationData(location: LocationData): Partial<LocationData> {
    return {
      latitude: Math.round(location.latitude * 100) / 100,
      longitude: Math.round(location.longitude * 100) / 100,
      timestamp: location.timestamp,
    };
  }

  static validateDataSharing(purpose: string, recipient: string): boolean {
    const allowedPurposes = ["analytics", "audit", "compliance", "emergency"];
    const allowedRecipients = ["internal", "regulator", "emergency_services"];
    return allowedPurposes.includes(purpose) && allowedRecipients.includes(recipient);
  }

  static createAuditLog(action: string, workerId: string, data: unknown): AuditLog {
    return {
      action,
      workerId,
      data,
      timestamp: new Date().toISOString(),
      dataAccessed: data ? Object.keys(data as Record<string, unknown>) : [],
    };
  }

  static isLocationInZone(location: LocationData, zone: Zone): boolean {
    const { latitude, longitude } = location;
    const { coordinates } = zone;
    
    if (coordinates && coordinates.length === 2 && 
        Array.isArray(coordinates[0]) && Array.isArray(coordinates[1]) &&
        coordinates[0].length === 2 && coordinates[1].length === 2) {
      const [minLat, maxLat] = coordinates[0] as [number, number];
      const [minLng, maxLng] = coordinates[1] as [number, number];
      return latitude >= minLat && latitude <= maxLat && 
             longitude >= minLng && longitude <= maxLng;
    }
    return false;
  }

  static validateLocationPrivacy(
    location: LocationData,
    accommodationZones: Zone[],
    workSchedule: WorkSchedule
  ): ValidationResult {
    const violations: string[] = [];
    const privateZones = accommodationZones.filter((zone: Zone) => zone.type === "private_quarters");
    
    if (privateZones.some((zone: Zone) => this.isLocationInZone(location, zone))) {
      violations.push("Location in private quarters zone - requires consent");
    }
    
    const currentHour = new Date().getHours();
    const isWorkingHours = currentHour >= workSchedule.startHour && 
                          currentHour <= workSchedule.endHour;
    const isEmergency = location.isEmergency || false;
    
    if (!isWorkingHours && !isEmergency) {
      violations.push("Location tracking outside working hours - requires justification");
    }
    
    if (location.accuracy !== undefined && location.accuracy < 10) {
      violations.push("Location data too precise - consider data minimization");
    }
    
    return { isCompliant: violations.length === 0, violations };
  }

  static validateWorkPermitCompliance(
    location: LocationData,
    workPermit: WorkPermit
  ): ValidationResult {
    const violations: string[] = [];
    
    if (workPermit.permittedStates && location.state) {
      if (!workPermit.permittedStates.includes(location.state)) {
        violations.push(`Location ${location.state} not in permitted states`);
      }
    }
    
    if (workPermit.sectorRestrictions) {
      const allowedZones = workPermit.sectorRestrictions.allowedZones || [];
      if (location.sector && !allowedZones.includes(location.sector)) {
        violations.push(`Sector ${location.sector} not allowed`);
      }
    }
    
    return { isCompliant: violations.length === 0, violations };
  }

  static generateComplianceReport(
    workerId: string,
    period: { start: string; end: string },
    verifications: Verification[]
  ): ComplianceReport {
    const allCompliant = verifications.every((v: Verification) => v.isCompliant);
    const someCompliant = verifications.some((v: Verification) => v.isCompliant);
    
    let status: "compliant" | "partial" | "non-compliant";
    if (allCompliant) {
      status = "compliant";
    } else if (someCompliant) {
      status = "partial";
    } else {
      status = "non-compliant";
    }
    
    return {
      workerId,
      period,
      verifications,
      timestamp: new Date().toISOString(),
      status,
    };
  }
}

export default PrivacyCompliance;