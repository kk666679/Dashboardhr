"use client";

import { FlowDesigner } from "../FlowDesigner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessFlowDesigner() {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Process Flow Designer</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <FlowDesigner />
      </CardContent>
    </Card>
  );
}
