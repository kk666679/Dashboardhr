"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Clock, DollarSign, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expatriate } from "@/components/features/employee/types";
import { ExpatStatusSchema } from "@/components/features/employee/schema";

const ExpatStatus = ExpatStatusSchema.enum;

const STATUS_COLORS: Record<Expatriate["status"], string> = {
  ONBOARDING: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  RELOCATION: "bg-yellow-100 text-yellow-800",
  RENEWAL_PENDING: "bg-orange-100 text-orange-800",
  TERMINATING: "bg-red-100 text-red-800",
  TERMINATED: "bg-gray-100 text-gray-800",
};

interface Props {
  expatriates: Expatriate[];
  onEdit?: (id: string) => void;
  onRenew?: (id: string) => void;
}

export default function ExpatriateList({
  expatriates,
  onEdit,
  onRenew,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    Expatriate["status"] | "all"
  >("all");

  const statusOptions = useMemo(
    () => Object.values(ExpatStatus) as Expatriate["status"][],
    [],
  );

  const filteredExpatriates = expatriates.filter((expatriate) => {
    const matchesSearch = (expatriate.employee?.name ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || expatriate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Expatriate["status"]) => (
    <Badge className={STATUS_COLORS[status]}>
      {status.replaceAll("_", " ").toUpperCase()}
    </Badge>
  );

  const getTotalAllowances = (allowances: Expatriate["allowances"]) =>
    allowances.reduce(
      (sum: number, allowance: { amount?: number }) =>
        sum + (allowance.amount ?? 0),
      0,
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">
            Expatriate Workers ({filteredExpatriates.length})
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Search expatriates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 rounded-md border px-3 py-1 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as Expatriate["status"] | "all",
              )
            }
            className="h-9 rounded-md border px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            {statusOptions.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExpatriates.map((expatriate) => (
          <Card
            key={expatriate.id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                {expatriate.employee?.name ?? "Unknown"}
                {getStatusBadge(expatriate.status)}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {expatriate.employee?.nationality ?? "Unknown"}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-medium">
                    {expatriate.employee?.position ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Visa:</span>
                  <span>{expatriate.employee?.visas[0]?.number ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span>EP Type:</span>
                  <Badge variant="outline" className="text-xs">EP1</Badge>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span>Expiry:</span>
                  <span className="text-sm">
                    {expatriate.employee?.visas[0]?.expiryDate
                      ? new Date(
                          expatriate.employee.visas[0].expiryDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                {expatriate.allowances.length > 0 && (
                  <div className="flex items-center justify-between gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>
                      Total Allowances: RM
                      {getTotalAllowances(expatriate.allowances).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit?.(expatriate.id)}
                >
                  Edit
                </Button>
                {expatriate.status === "RENEWAL_PENDING" && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => onRenew?.(expatriate.id)}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Renew
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpatriates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No expatriates found</h3>
            <p className="mb-4 text-muted-foreground">
              No expatriates match your filters.
            </p>
            <Button variant="outline">Add First Expatriate</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
