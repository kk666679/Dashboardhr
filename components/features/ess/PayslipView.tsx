import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye } from "lucide-react";

interface Payslip {
  id: string;
  month: string;
  year: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: "Generated" | "Paid";
  details: { description: string; amount: number }[];
}

interface PayslipViewProps {
  payslips: Payslip[];
  selectedMonth?: string;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function PayslipView({ payslips, selectedMonth, onView, onDownload }: PayslipViewProps) {
  const [selected, setSelected] = useState(selectedMonth || (payslips[0]?.month + " " + payslips[0]?.year));

  const current = payslips.find(p => p.month + " " + p.year === selected);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payslips</h2>
        <div className="flex items-center gap-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {payslips.map((p) => (
                <SelectItem key={p.id} value={p.month + " " + p.year}>
                  {p.month} {p.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {current && (
            <>
              <Button variant="outline" size="sm" onClick={() => onView(current.id)}>
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload(current.id)}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </>
          )}
        </div>
      </div>

      {current && (
        <Card>
          <CardHeader>
            <CardTitle>Payslip for {current.month} {current.year}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium">Gross Salary</span>
                <p className="text-xl font-bold">RM {current.grossSalary}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Deductions</span>
                <p className="text-xl font-bold text-red-600">RM {current.deductions}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Net Salary</span>
                <p className="text-xl font-bold text-green-600">RM {current.netSalary}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Details</span>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {current.details.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>{d.description}</TableCell>
                      <TableCell className="text-right">RM {d.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
