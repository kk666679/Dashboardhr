"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function NewEmployeePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    passport: '',
    isForeign: false,
    position: '',
    department: '',
    hireDate: new Date(),
    address: '',
    dateOfBirth: undefined as Date | undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate createEmployee action
    console.log('Creating employee:', formData);
    setLoading(false);
  };

  return (
    <div className={`space-y-6 p-6 max-w-2xl mx-auto`}>
      <div className={`flex items-center gap-4`}>
        <Button variant={`ghost`} size={`sm`} asChild>
          <Link href={`/dashboard/employees`}>
            <ArrowLeft className={`h-4 w-4 mr-2`} />
            Back to Employees
          </Link>
        </Button>
        <div>
          <h1 className={`text-3xl font-bold`}>New Employee</h1>
          <p className={`text-muted-foreground`}>Create a new employee profile</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className={`space-y-6`}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core employee details</CardDescription>
          </CardHeader>
          <CardContent className={`space-y-4`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <div className={`space-y-2`}>
                <Label htmlFor={`name`}>Full Name</Label>
                <Input 
                  id={`name`} 
                  placeholder={`John Doe`} 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className={`space-y-2`}>
                <Label htmlFor={`email`}>Email</Label>
                <Input 
                  id={`email`} 
                  type={`email`}
                  placeholder={`john.doe@company.com`} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className={`space-y-2`}>
                <Label htmlFor={`phone`}>Phone</Label>
                <Input 
                  id={`phone`} 
                  placeholder={`+60 123 456 789`} 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className={`space-y-2`}>
                <Label htmlFor={`position`}>Position</Label>
                <Input 
                  id={`position`} 
                  placeholder={`Software Engineer`} 
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <div className={`space-y-2`}>
                <Label htmlFor={`department`}>Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select department`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={`engineering`}>Engineering</SelectItem>
                    <SelectItem value={`hr`}>HR</SelectItem>
                    <SelectItem value={`finance`}>Finance</SelectItem>
                    <SelectItem value={`operations`}>Operations</SelectItem>
                    <SelectItem value={`sales`}>Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={`space-y-2`}>
                <Label htmlFor={`nationality`}>Nationality</Label>
                <Input 
                  id={`nationality`} 
                  placeholder={`Malaysian`} 
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className={`space-y-2`}>
              <Label htmlFor={`isForeign`}>Foreign Worker</Label>
              <div className={`flex items-center space-x-2`}>
                <input
                  type={`checkbox`}
                  id={`isForeign`}
                  checked={formData.isForeign}
                  onChange={(e) => setFormData({...formData, isForeign: e.target.checked})}
                  className={`rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500`}
                />
                <label htmlFor={`isForeign`} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}>
                  Employee requires work visa/permits
                </label>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <div className={`space-y-2`}>
                <Label>Hire Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={`outline`}
                      className={cn(
                        `w-full justify-start text-left font-normal`,
                        !formData.hireDate && `text-muted-foreground`
                      )}
                    >
                      <CalendarIcon className={`mr-2 h-4 w-4`} />
                      {formData.hireDate ? format(formData.hireDate, `PPP`) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`w-auto p-0`}>
                    {/* Calendar component */}
                    <div>Calendar placeholder</div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className={`space-y-2`}>
                <Label>Passport / ID</Label>
                <Input 
                  placeholder={`AB1234567`} 
                  value={formData.passport}
                  onChange={(e) => setFormData({...formData, passport: e.target.value})}
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <div className={`space-y-2`}>
                <Label htmlFor={`address`}>Address</Label>
                <Input 
                  id={`address`} 
                  placeholder={`123 Jalan Example, Kuala Lumpur`} 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className={`space-y-2`}>
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={`outline`}
                      className={cn(
                        `w-full justify-start text-left font-normal`,
                        !formData.dateOfBirth && `text-muted-foreground`
                      )}
                    >
                      <CalendarIcon className={`mr-2 h-4 w-4`} />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, `PPP`) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`w-auto p-0`}>
                    <div>Calendar placeholder</div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          
          <div className={`flex justify-end gap-3 pt-6 border-t`}>
            <Button type={`button`} variant={`outline`} asChild>
              <Link href={`/dashboard/employees`}>Cancel</Link>
            </Button>
            <Button type={`submit`} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={`mr-2 h-4 w-4 animate-spin`} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className={`mr-2 h-4 w-4`} />
                  Create Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
