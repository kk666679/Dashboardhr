import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  industry: string;
  size: string;
  founded: string;
  status: "Active" | "Inactive" | "Pending";
  address: string;
  phone: string;
  email: string;
  website: string;
  parentCompany?: string;
}

interface CompanyProfileProps {
  company: Company;
  onEdit?: () => void;
}

export function CompanyProfile({ company, onEdit }: CompanyProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{company.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={company.status === "Active" ? "success" : company.status === "Pending" ? "warning" : "secondary"}>
              {company.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Registration Number</span>
            <p>{company.registrationNumber}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Industry</span>
            <p>{company.industry}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Company Size</span>
            <p>{company.size}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Founded</span>
            <p>{new Date(company.founded).toLocaleDateString()}</p>
          </div>
          {company.parentCompany && (
            <div>
              <span className="text-sm font-medium">Parent Company</span>
              <p>{company.parentCompany}</p>
            </div>
          )}
          <div className="col-span-2">
            <span className="text-sm font-medium">Address</span>
            <p>{company.address}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Phone</span>
            <p>{company.phone}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Email</span>
            <p>{company.email}</p>
          </div>
          <div className="col-span-2">
            <span className="text-sm font-medium">Website</span>
            <p>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {company.website}
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
