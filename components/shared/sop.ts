/**
 * Shared SOP feature barrel.
 *
 * Re-exports the SOP feature components so pages can consume them via the
 * `@shared/` alias instead of reaching deep into `components/features/sop`.
 */
export { SopDashboard } from "@/components/features/sop/SopDashboard";
export { default as SopDetail } from "@/components/features/sop/SopDetail";
export { default as SopList } from "@/components/features/sop/SopList";
export { SopApprovalList as SopApproval } from "@/components/features/sop/SopApproval";
export { SopArtifactList as SopArtifact } from "@/components/features/sop/SopArtifact";
export { SopAuditEventList as SopAuditEvent } from "@/components/features/sop/SopAuditEvent";
export { SopComplianceItemList as SopComplianceItem } from "@/components/features/sop/SopComplianceItem";
export { default as SopMetricsChart } from "@/components/features/sop/SopMetricsChart";
export { default as SopSearch } from "@/components/features/sop/SopSearch";
export { SopStatusBadge } from "@/components/features/sop/SopStatusBadge";
export { SopVersionCard } from "@/components/features/sop/SopVersionCard";
export { default as SopWizard } from "@/components/features/sop/SopWizard";
