// Delivery Order PDF Generation Utility
// This utility generates professional PDF documents for delivery orders
// with Malaysian compliance and company branding

export interface DeliveryOrderPDFData {
  // Order Information
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  deliveryTime: string;
  priority: string;

  // Customer Information
  customer: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  // Recipient Information
  recipient: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  // Delivery Information
  delivery: {
    method: string;
    instructions?: string;
    driverName?: string;
    vehicleNumber?: string;
  };

  // Line Items
  items: Array<{
    serviceType: string;
    description: string;
    workerName?: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;

  // Financial Information
  subtotal: number;
  sst: number;
  total: number;

  // Additional Information
  terms?: string;
  notes?: string;
}

export class DeliveryOrderPDFGenerator {
  private static readonly COMPANY_INFO = {
    name: "FWMS - Foreign Worker Management System",
    address: "123 Business Center, Kuala Lumpur, Malaysia",
    phone: "+60 3-1234 5678",
    email: "info@fwms.com.my",
    website: "www.fwms.com.my",
    registrationNo: "123456-A",
    sstNo: "SST-12345678",
  };

  static async generatePDF(data: DeliveryOrderPDFData): Promise<Blob> {
    // This is a mock implementation
    // In a real application, you would use a PDF library like jsPDF, PDFKit, or Puppeteer

    const pdfContent = this.generatePDFContent(data);

    // Simulate PDF generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob([pdfContent], { type: "application/pdf" });
        resolve(blob);
      }, 1000);
    });
  }

  private static generatePDFContent(data: DeliveryOrderPDFData): string {
    return `
      DELIVERY ORDER PDF CONTENT
      
      Company: ${this.COMPANY_INFO.name}
      Order Number: ${data.orderNumber}
      Date: ${data.orderDate}
      
      Customer: ${data.customer.name}
      Delivery Date: ${data.deliveryDate}
      
      Items:
      ${data.items.map((item) => `- ${item.description} (${item.quantity}x) - RM ${item.amount.toFixed(2)}`).join("\n")}
      
      Total: RM ${data.total.toFixed(2)}
      
      Terms: ${data.terms || "Standard delivery terms apply"}
    `;
  }

  static async downloadPDF(
    data: DeliveryOrderPDFData,
    filename?: string,
  ): Promise<void> {
    const blob = await this.generatePDF(data);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `delivery-order-${data.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  static async previewPDF(data: DeliveryOrderPDFData): Promise<string> {
    const blob = await this.generatePDF(data);
    return URL.createObjectURL(blob);
  }

  static getTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Delivery Order</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company-info { text-align: right; }
          .order-info { margin: 20px 0; }
          .customer-info { margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .totals { text-align: right; margin: 20px 0; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; }
          .terms { margin: 20px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <!-- PDF template content would go here -->
      </body>
      </html>
    `;
  }
}

// Bound exports — static methods must be bound to preserve `this` when called as standalone functions
export const generateDeliveryOrderPDF =
  DeliveryOrderPDFGenerator.generatePDF.bind(DeliveryOrderPDFGenerator);
export const downloadDeliveryOrderPDF =
  DeliveryOrderPDFGenerator.downloadPDF.bind(DeliveryOrderPDFGenerator);
export const previewDeliveryOrderPDF =
  DeliveryOrderPDFGenerator.previewPDF.bind(DeliveryOrderPDFGenerator);
