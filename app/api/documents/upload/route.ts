import { NextRequest, NextResponse } from "next/server";
import {
  uploadDocument,
  getUploadedDocuments,
} from "@/components/features/employee/ess/ess-service";

export async function POST(request: NextRequest) {
  const employeeId = request.headers.get("X-Employee-ID");
  const tenantId = request.headers.get("X-Tenant-ID") || "tenant1";

  if (!employeeId) {
    return NextResponse.json(
      { error: "Employee ID required" },
      { status: 400 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const expiryDateStr = formData.get("expiryDate") as string;

    if (!file || !documentType) {
      return NextResponse.json(
        { error: "File and documentType required" },
        { status: 400 },
      );
    }

    const doc = await uploadDocument({
      employeeId,
      tenantId,
      documentType,
      file,
      expiryDate: expiryDateStr ? new Date(expiryDateStr) : undefined,
    });

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const employeeId = request.headers.get("X-Employee-ID");

  if (!employeeId) {
    return NextResponse.json(
      { error: "Employee ID required" },
      { status: 400 },
    );
  }

  try {
    const documents = await getUploadedDocuments(employeeId);
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}
