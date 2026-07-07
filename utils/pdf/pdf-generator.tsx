/**
 * Complete React PDF Generator for FWMS
 * Malaysian compliance formatting with Inter font
 * Supports invoice, payslip, permit, report
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf,
  Link,
} from "@react-pdf/renderer";
import { AIDocResponse } from "@/types/ai-docs";

// Register Inter font for Malaysian compliance
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50_acvantQrI.ttf", // Inter Regular
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50_acvantKlY.ttf", // Inter Bold
      fontWeight: 700,
    },
  ],
});

// Shared styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    padding: 40,
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: 20,
    textAlign: "center" as const,
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0066cc",
    marginTop: 15,
    marginBottom: 8,
  },
  table: {
    marginTop: 10,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f8f9fa",
  },
  totalRow: {
    backgroundColor: "#e8f5e8",
    fontWeight: "bold",
  },
  currency: {
    fontWeight: "bold",
    fontSize: 11,
  },
});

// FWMS Company Info (MY compliance)
const COMPANY_INFO = {
  name: "FWMS - Foreign Worker Management System",
  address: "123 Business Centre, Kuala Lumpur 50450, Malaysia",
  phone: "+60 3-1234 5678",
  email: "info@fwms.com.my",
  sstNo: "SST-12345678",
};

interface PDFProps {
  data: any;
  docType: string;
}

const Header = ({ docType }: { docType: string }) => (
  <View style={{ marginBottom: 30 }}>
    <Text style={styles.header}>{docType.toUpperCase()} - FWMS</Text>
    <Text style={styles.companyInfo}>
      {COMPANY_INFO.name} | {COMPANY_INFO.address}
    </Text>
    <Text style={styles.companyInfo}>
      Tel: {COMPANY_INFO.phone} | {COMPANY_INFO.email} | SST No:{" "}
      {COMPANY_INFO.sstNo}
    </Text>
  </View>
);

const InvoicePDF = ({ data }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header docType="Invoice" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View style={{ width: "48%" }}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{data.customerName}</Text>
          <Text>{data.customerAddress}</Text>
          <Text>{data.customerEmail}</Text>
        </View>
        <View style={{ width: "48%", alignItems: "flex-end" }}>
          <Text style={styles.sectionTitle}>Invoice Details:</Text>
          <Text>Invoice #: {data.invoiceNumber}</Text>
          <Text>Date: {data.issueDate}</Text>
          <Text>Due: {data.dueDate}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={{ width: "55%" }}>Description</Text>
          <Text style={{ width: "12%" }}>Qty</Text>
          <Text style={{ width: "16%" }}>Unit Price</Text>
          <Text style={{ width: "17%" }}>Total</Text>
        </View>
        {data.items?.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: "55%" }}>{item.description}</Text>
            <Text style={{ width: "12%" }}>{item.quantity}</Text>
            <Text style={{ width: "16%" }}>RM {item.unitPrice.toFixed(2)}</Text>
            <Text style={{ width: "17%" }}>RM {item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={{ alignItems: "flex-end", marginTop: 15 }}>
        <View
          style={{
            width: "40%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Subtotal:</Text>
          <Text>RM {data.subtotal?.toFixed(2)}</Text>
        </View>
        <View
          style={{
            width: "40%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>SST (6%):</Text>
          <Text>RM {data.taxAmount?.toFixed(2)}</Text>
        </View>
        <View
          style={[
            styles.totalRow,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 8,
            },
          ]}
        >
          <Text>TOTAL:</Text>
          <Text style={styles.currency}>RM {data.total?.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={{ marginTop: 40, fontSize: 8, color: "#666" }}>
        Terms: Net 30 days. Malaysian SST compliant.
      </Text>
    </Page>
  </Document>
);

const PayslipPDF = ({ data }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header docType="Payslip" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View style={{ width: "48%" }}>
          <Text style={styles.sectionTitle}>Worker Details</Text>
          <Text>
            {data.workerName} (ID: {data.workerId})
          </Text>
          <Text>Position: {data.position}</Text>
          <Text>Period: {data.payPeriod}</Text>
        </View>
        <View style={{ width: "48%" }}>
          <Text style={styles.sectionTitle}>Payment Info</Text>
          <Text>Days Worked: {data.daysWorked}</Text>
          <Text>Payment Date: {data.paymentDate}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "48%" }}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ width: "60%" }}>Description</Text>
              <Text style={{ width: "40%" }}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>Basic Salary</Text>
              <Text style={{ width: "40%" }}>
                RM {data.basicSalary?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>Overtime</Text>
              <Text style={{ width: "40%" }}>
                RM {data.overtimePay?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>Allowances</Text>
              <Text style={{ width: "40%" }}>
                RM {data.allowances?.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={{ width: "60%" }}>Gross Pay</Text>
              <Text style={styles.currency}>
                RM {data.grossPay?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: "48%", marginLeft: 20 }}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ width: "60%" }}>Statutory</Text>
              <Text style={{ width: "40%" }}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>EPF (11%)</Text>
              <Text style={{ width: "40%" }}>
                RM {data.epfEmployee?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>SOCSO</Text>
              <Text style={{ width: "40%" }}>
                RM {data.socsoEmployee?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>EIS (0.2%)</Text>
              <Text style={{ width: "40%" }}>
                RM {data.eisEmployee?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>PCB Tax</Text>
              <Text style={{ width: "40%" }}>RM {data.pcbTax?.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={{ width: "60%" }}>Levy</Text>
              <Text style={{ width: "40%" }}>
                RM {data.levyAmount?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "flex-end", marginTop: 15 }}>
        <View
          style={[
            styles.totalRow,
            {
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignSelf: "flex-end",
            },
          ]}
        >
          <Text style={styles.currency}>
            NET PAY: RM {data.netPay?.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={{ marginTop: 30, fontSize: 8, color: "#666" }}>
        Employer Contributions: EPF 12%, SOCSO 1.75%, EIS 0.2% | MY Labour Law
        Compliant
      </Text>
    </Page>
  </Document>
);

const PermitPDF = ({ data }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header docType="Work Permit" />

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View
          style={{
            width: "30%",
            height: 120,
            borderWidth: 1,
            borderColor: "#ddd",
            marginRight: 20,
          }}
        >
          <Text style={{ textAlign: "center" as const, marginTop: 50 }}>
            PHOTO
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Permit No: {data.permitNumber}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Worker Name:</Text>
          <Text style={{ width: "65%" }}>{data.workerName}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Passport:</Text>
          <Text style={{ width: "65%" }}>{data.passportNumber}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Nationality:</Text>
          <Text style={{ width: "65%" }}>{data.nationality}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>DOB/Gender:</Text>
          <Text style={{ width: "65%" }}>
            {data.dateOfBirth} / {data.gender}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Employer:</Text>
          <Text style={{ width: "65%" }}>{data.employerName}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Job:</Text>
          <Text style={{ width: "65%" }}>{data.jobCategory}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Location:</Text>
          <Text style={{ width: "65%" }}>{data.workLocation}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Valid:</Text>
          <Text style={{ width: "65%" }}>
            {data.issueDate} to {data.expiryDate}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ width: "35%", fontWeight: "bold" }}>Status:</Text>
          <Text style={{ width: "65%" }}>{data.status}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Conditions:</Text>
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 9 }}>
          • Valid only for specified employer/location
        </Text>
        <Text style={{ fontSize: 9 }}>• Carry at all times during work</Text>
        <Text style={{ fontSize: 9 }}>
          • Report changes to Immigration Dept
        </Text>
      </View>

      <Text
        style={{
          position: "absolute" as any,
          bottom: 40,
          left: 40,
          right: 40,
          fontSize: 8,
          color: "#999",
          textAlign: "center",
        }}
      >
        Issued under Immigration Act 1959/63 | MY Compliant
      </Text>
    </Page>
  </Document>
);

const ReportPDF = ({ data }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header docType={`${data.reportType} Report`} />

      <View style={{ marginBottom: 20 }}>
        <Text>ID: {data.reportId}</Text>
        <Text>Period: {data.period}</Text>
        <Text>Generated: {new Date().toLocaleDateString()}</Text>
        <Text>
          Records: {data.totalRecords}, Compliance: {data.complianceStatus}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Data Summary</Text>
      {data.headers && data.rows && (
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {data.headers.map((header: string, i: number) => (
              <Text key={i} style={{ width: `${100 / data.headers.length}%` }}>
                {header}
              </Text>
            ))}
          </View>
          {data.rows.map((row: string[], i: number) => (
            <View key={i} style={styles.tableRow}>
              {row.map((cell: string, j: number) => (
                <Text
                  key={j}
                  style={{ width: `${100 / data.headers.length}%` }}
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={{ alignItems: "flex-end", marginTop: 15 }}>
        <Text style={styles.currency}>
          Total Amount: RM {data.totalAmount?.toFixed(2)}
        </Text>
      </View>
    </Page>
  </Document>
);

// Main Generator Class
export class PDFGenerator {
  static async generatePDF(
    data: AIDocResponse["data"],
    options: any = {},
  ): Promise<Blob> {
    const { docType, data: docData } = data;

    let component: React.ReactElement<any, any>;

    switch (docType) {
      case "invoice":
        component = <InvoicePDF data={docData} docType="Invoice" />;
        break;
      case "payslip":
        component = <PayslipPDF data={docData} docType="Payslip" />;
        break;
      case "permit":
        component = <PermitPDF data={docData} docType="Work Permit" />;
        break;
      case "report":
        component = (
          <ReportPDF data={docData} docType={docData.reportType || "Report"} />
        );
        break;
      default:
        throw new Error(`Unsupported docType: ${docType}`);
    }

    const blob = await pdf(component).toBlob();
    return blob;
  }

  static async downloadPDF(blob: Blob, filename: string): Promise<void> {
    if (typeof window === "undefined")
      throw new Error("downloadPDF is browser-only");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async previewPDF(blob: Blob): Promise<string> {
    if (typeof window === "undefined")
      throw new Error("previewPDF is browser-only");
    return URL.createObjectURL(blob);
  }
}

// Backwards compatibility
export const generateInvoicePDF = (data: any, options?: any) =>
  PDFGenerator.generatePDF({ docType: "invoice" as const, data }, options);
export const generatePayslipPDF = (data: any, options?: any) =>
  PDFGenerator.generatePDF({ docType: "payslip" as const, data }, options);
export const generatePermitPDF = (data: any, options?: any) =>
  PDFGenerator.generatePDF({ docType: "permit" as const, data }, options);
export const generateGovernmentReportPDF = (data: any, options?: any) =>
  PDFGenerator.generatePDF({ docType: "report" as const, data }, options);
