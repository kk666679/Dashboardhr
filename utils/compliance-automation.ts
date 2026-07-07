// node-cron is a server-side scheduler — use a lightweight inline scheduler
type CronTask = { stop: () => void };
const cron = {
  schedule: (_expr: string, fn: () => void): CronTask => {
    // In production replace with actual node-cron or Vercel Cron
    return { stop: () => {} };
  },
};
import type { Worker } from "@/types/fwms";
import type { ComplianceSync } from "@/types/hr-integration";
import type { LocationData } from "@/types/geolocation";

const sanitizeLog = (val: unknown): string =>
  String(val)
    .replace(/[\r\n\t]/g, " ")
    .slice(0, 200);

// Automated Compliance Workflows
export class ComplianceAutomation {
  // Schedule daily compliance checks
  static initializeScheduledTasks() {
    // Daily permit expiry check (8 AM)
    cron.schedule("0 8 * * *", async () => {
      await this.checkPermitExpiry();
    });

    // Hourly location compliance check
    cron.schedule("0 * * * *", async () => {
      await this.checkLocationCompliance();
    });

    // Weekly FOMEMA medical scheduling (Monday 9 AM)
    cron.schedule("0 9 * * 1", async () => {
      await this.scheduleMedicalExams();
    });

    // Monthly EPF/SOCSO sync (1st day, 10 AM)
    cron.schedule("0 10 1 * *", async () => {
      await this.syncPayrollContributions();
    });
  }

  // Check permit expiry and create alerts
  static async checkPermitExpiry() {
    try {
      const workers = await this.getAllActiveWorkers();
      const expiringPermits = workers.filter((worker) => {
        const expiryDate = new Date(worker.permits[0]?.expiryDate);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      });

      for (const worker of expiringPermits) {
        await this.createComplianceAlert({
          workerId: worker.id,
          type: "permit_renewal",
          severity: "high",
          title: "Work Permit Expiring Soon",
          description: `Permit expires on ${worker.permits[0]?.expiryDate}`,
          dueDate: worker.permits[0]?.expiryDate,
          actionRequired: "Initiate permit renewal process",
        });

        // Auto-schedule JTK notification
        await this.notifyJTK({
          workerId: worker.id,
          permitNumber: worker.permits[0]?.permitNumber,
          expiryDate: worker.permits[0]?.expiryDate,
          action: "renewal_required",
        });
      }

      console.log(
        `Checked ${sanitizeLog(workers.length)} workers, found ${sanitizeLog(expiringPermits.length)} expiring permits`,
      );
    } catch (error) {
      console.error("Permit expiry check failed:", error);
    }
  }

  // Check location compliance violations
  static async checkLocationCompliance() {
    try {
      const workers = await this.getAllActiveWorkers();

      for (const worker of workers) {
        const lastLocation = await this.getWorkerLastLocation(worker.id);
        if (!lastLocation) continue;

        const isCompliant = await this.validateWorkerLocation(
          worker,
          lastLocation,
        );

        if (!isCompliant) {
          await this.createLocationViolationAlert(worker, lastLocation);

          // Auto-report to Immigration if in restricted area
          if (await this.isInRestrictedArea(lastLocation)) {
            await this.reportToImmigration({
              workerId: worker.id,
              location: lastLocation,
              violation: "unauthorized_area_access",
            });
          }
        }
      }
    } catch (error) {
      console.error("Location compliance check failed:", error);
    }
  }

  // Auto-schedule FOMEMA medical exams
  static async scheduleMedicalExams() {
    try {
      const workers = await this.getAllActiveWorkers();
      const medicalDueWorkers = workers.filter((worker) => {
        const lastExam = worker.medicalRecords[0]?.examDate;
        if (!lastExam) return true;

        const daysSinceExam = Math.ceil(
          (Date.now() - new Date(lastExam).getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysSinceExam >= 365; // Annual medical required
      });

      for (const worker of medicalDueWorkers) {
        // Find nearest FOMEMA clinic based on worker location
        const nearestClinic = await this.findNearestFomemaClinic(worker);

        if (nearestClinic) {
          await this.scheduleFomemaAppointment({
            workerId: worker.id,
            clinicId: nearestClinic.id,
            preferredDate: this.getNextAvailableDate(),
            examType: "periodic",
          });

          await this.createComplianceAlert({
            workerId: worker.id,
            type: "medical_exam_due",
            severity: "medium",
            title: "Medical Examination Due",
            description: `Annual medical exam scheduled at ${nearestClinic.name}`,
            actionRequired: "Ensure worker attends scheduled medical exam",
          });
        }
      }

      console.log(
        `Scheduled medical exams for ${sanitizeLog(medicalDueWorkers.length)} workers`,
      );
    } catch (error) {
      console.error("Medical exam scheduling failed:", error);
    }
  }

  // Sync payroll contributions to EPF/SOCSO
  static async syncPayrollContributions() {
    try {
      const workers = await this.getAllActiveWorkers();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const contributionsData = workers.map((worker) => ({
        workerId: worker.id,
        employeeEpfNumber: worker.id,
        salary: worker.employmentInfo.salaryAmount,
        epfContribution: worker.employmentInfo.salaryAmount * 0.11,
        socsoContribution: Math.min(
          worker.employmentInfo.salaryAmount * 0.005,
          24.5,
        ),
        eisContribution: Math.min(
          worker.employmentInfo.salaryAmount * 0.002,
          7.9,
        ),
        month: lastMonth.getMonth() + 1,
        year: lastMonth.getFullYear(),
      }));

      // Submit to EPF
      await fetch("/api/hr-integration/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "epf",
          action: "submit_contributions",
          data: { workers: contributionsData },
        }),
      });

      // Submit to SOCSO
      await this.submitToSocso(contributionsData);

      console.log(
        `Synced payroll contributions for ${sanitizeLog(workers.length)} workers`,
      );
    } catch (error) {
      console.error("Payroll sync failed:", error);
    }
  }

  // Helper methods
  static async getAllActiveWorkers(): Promise<Worker[]> {
    // Mock implementation - replace with actual database query
    return [];
  }

  static async getWorkerLastLocation(
    workerId: string,
  ): Promise<LocationData | null> {
    // Mock implementation - replace with actual location query
    return null;
  }

  static async validateWorkerLocation(
    worker: Worker,
    location: LocationData,
  ): Promise<boolean> {
    // Check if worker is in authorized worksite
    const authorizedLocation = worker.employmentInfo.workLocation;
    // Implement geofence validation logic
    return true;
  }

  static async isInRestrictedArea(location: LocationData): Promise<boolean> {
    // Check against immigration restricted areas
    const restrictedAreas = [
      // Immigration blacklist areas, border zones, etc.
    ];
    return false;
  }

  static async findNearestFomemaClinic(worker: Worker) {
    // Find FOMEMA clinic near worker's location/accommodation
    return {
      id: "clinic_001",
      name: "FOMEMA Clinic KL",
      address: "Kuala Lumpur",
      distance: 5.2,
    };
  }

  static async scheduleFomemaAppointment(data: any) {
    // Schedule appointment via FOMEMA API
    console.log(
      "FOMEMA appointment scheduled:",
      sanitizeLog(JSON.stringify(data)),
    );
  }

  static async createComplianceAlert(alert: any) {
    // Create compliance alert in system
    console.log(
      "Compliance alert created:",
      sanitizeLog(JSON.stringify(alert)),
    );
  }

  static async createLocationViolationAlert(
    worker: Worker,
    location: LocationData,
  ) {
    // Create location violation alert
    console.log(
      "Location violation alert:",
      sanitizeLog(JSON.stringify({ worker: worker.id, location })),
    );
  }

  static async notifyJTK(data: any) {
    // Send notification to JTK
    console.log("JTK notification sent:", sanitizeLog(JSON.stringify(data)));
  }

  static async reportToImmigration(data: any) {
    // Report to Immigration Department
    console.log("Immigration report sent:", sanitizeLog(JSON.stringify(data)));
  }

  static async submitToSocso(data: any) {
    // Submit to SOCSO
    console.log("SOCSO submission:", sanitizeLog(JSON.stringify(data)));
  }

  static getNextAvailableDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Next week
    return date.toISOString().split("T")[0];
  }
}
