import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEmployeeById } from '@/components/features/employee/employee-service';
import { Globe, Briefcase, Calendar, FileText, DollarSign, File } from 'lucide-react';

interface Props {
  params: { id: string; tenantId: string };
}

export default async function EmployeeDetailPage({ params }: Props) {
  const employee = await getEmployeeById(params.id, params.tenantId);

  if (!employee) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-6">
        <div className="flex flex-col items-center md:flex-row md:items-center gap-6 mb-6 md:mb-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`/api/avatar/${employee.email}`} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {employee.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{employee.name}</h1>
            <p className="text-xl text-muted-foreground">{employee.position} · {employee.department}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={employee.isForeign ? 'default' : 'secondary'}>
                {employee.isForeign ? 'Foreign Worker' : 'Local'}
              </Badge>
              <Badge>{employee.nationality}</Badge>
              {employee.visas?.[0]?.status && (
                <Badge variant="outline">{employee.visas[0].status}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 ml-auto">
          <Button variant="outline">Edit Profile</Button>
          <Button variant="outline">View Documents</Button>
          <Button variant="outline">Payroll History</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hire Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {employee.hireDate?.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{employee.contracts?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visas</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{employee.visas?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{employee.documents?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="visas">Visas & Permits ({employee.visas?.length || 0})</TabsTrigger>
          <TabsTrigger value="contracts">Contracts ({employee.contracts?.length || 0})</TabsTrigger>
          <TabsTrigger value="payroll">Payroll (12m)</TabsTrigger>
          <TabsTrigger value="documents">Documents ({employee.documents?.length || 0})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd className="text-lg">{employee.email}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd>{employee.phone || 'Not provided'}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                  <dd>{employee.address || 'Not provided'}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Passport/ID</dt>
                  <dd>{employee.documents?.find(d => d.type === 'PASSPORT')?.fileUrl || 'N/A'}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                  <dd>{employee.dateOfBirth?.toLocaleDateString() || 'Not provided'}</dd>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Position</dt>
                  <dd className="text-lg font-semibold">{employee.position}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                  <dd className="text-lg">{employee.department}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Hire Date</dt>
                  <dd className="text-lg">{employee.hireDate?.toLocaleDateString()}</dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-sm font-medium text-muted-foreground">Tenure</dt>
                  <dd>1 year 3 months</dd>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visa & Permit History</CardTitle>
              <CardDescription>Current and expired visas</CardDescription>
            </CardHeader>
            <CardContent>
              {employee.visas?.length ? (
                <div className="space-y-4">
                  {employee.visas.map((visa) => (
                    <div key={visa.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{visa.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {visa.status} · Expires {visa.expiryDate?.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>{visa.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No visas recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Employment Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contract details would go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History (Last 12 months)</CardTitle>
              <CardDescription>Salary payments and deductions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">RM 4,200</div>
                    <p className="text-sm text-muted-foreground">Monthly Average</p>
                  </CardContent>
                </Card>
                {/* More payroll cards */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Documents list would go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Performance data would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

