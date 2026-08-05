import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, FileText } from "lucide-react";

interface CandidateViewProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    stage: string;
    appliedDate: string;
    resume?: string;
    notes?: string;
    skills?: string[];
    experience?: string;
    education?: string;
  };
}

export function CandidateView({ candidate }: CandidateViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{candidate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-muted-foreground">{candidate.jobTitle}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={candidate.stage === "Hired" ? "success" : candidate.stage === "Rejected" ? "destructive" : "warning"}>
                {candidate.stage}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Applied {new Date(candidate.appliedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-1" /> Email
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-1" /> Call
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-1" /> Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {candidate.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {candidate.experience && (
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{candidate.experience}</p>
          </CardContent>
        </Card>
      )}

      {candidate.education && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{candidate.education}</p>
          </CardContent>
        </Card>
      )}

      {candidate.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{candidate.notes}</p>
          </CardContent>
        </Card>
      )}

      {candidate.resume && (
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-1" /> Download Resume
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
