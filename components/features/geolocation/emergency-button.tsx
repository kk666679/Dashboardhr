"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Phone, Shield } from "lucide-react";
import { useTriggerEmergencyAlertMutation } from "@/server/api/geolocation-api";

interface EmergencyButtonProps {
  workerId: string;
}

export function EmergencyButton({ workerId }: EmergencyButtonProps) {
  const [emergencyType, setEmergencyType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isTriggering, setIsTriggering] = useState(false);

  const [triggerEmergency] = useTriggerEmergencyAlertMutation();

  const handleEmergency = async () => {
    if (!emergencyType) return;

    setIsTriggering(true);

    try {
      // Get current location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await triggerEmergency({
            workerId,
            type: emergencyType,
            location: {
              id: "",
              userId: workerId,
              workerId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString(),
              source: "gps",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            message: message || undefined,
          });

          setMessage("");
          setEmergencyType("");
          setIsTriggering(false);
        },
        (error: GeolocationPositionError) => {
          console.error("Location error:", String(error).slice(0, 200));
          setIsTriggering(false);
        },
      );
    } catch (error: unknown) {
      console.error("Emergency alert error:", String(error).slice(0, 200));
      setIsTriggering(false);
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Emergency Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            size="lg"
            className="h-16 bg-red-600 hover:bg-red-700"
            onClick={() => {
              setEmergencyType("sos");
              handleEmergency();
            }}
            disabled={isTriggering}
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            SOS
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="h-16 border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Phone className="h-6 w-6 mr-2" />
                Report Issue
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Report Emergency</AlertDialogTitle>
                <AlertDialogDescription>
                  Select the type of emergency and provide additional details.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <Select value={emergencyType} onValueChange={setEmergencyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="panic">Safety Concern</SelectItem>
                    <SelectItem value="sos">General Emergency</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Describe the situation (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEmergency}
                  disabled={!emergencyType || isTriggering}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isTriggering ? "Sending..." : "Send Alert"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Emergency Contacts</p>
              <p className="text-yellow-700">
                Your location will be shared with HR and emergency responders
                when an alert is triggered.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
