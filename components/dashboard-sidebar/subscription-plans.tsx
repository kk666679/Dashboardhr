"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "RM 0",
    features: ["Up to 10 employees", "Basic reports", "Email support"],
    cta: "Current Plan",
  },
  {
    id: "pro",
    name: "Pro",
    price: "RM 99/mo",
    features: ["Up to 100 employees", "Advanced reports", "Priority support", "API access"],
    cta: "Upgrade",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited employees", "Custom reports", "Dedicated support", "SSO"],
    cta: "Contact Sales",
  },
];

export function SubscriptionPlans() {
  const [selected, setSelected] = useState("starter");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col",
              plan.popular && "border-primary shadow-lg"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 right-4">Popular</Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plan.id === "pro" && <Zap className="h-5 w-5 text-yellow-500" />}
                {plan.id === "enterprise" && <Crown className="h-5 w-5 text-purple-500" />}
                {plan.name}
              </CardTitle>
              <p className="text-2xl font-bold">{plan.price}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="flex-1 space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={selected === plan.id ? "default" : "outline"}
                className="w-full"
                disabled={selected === plan.id}
                onClick={() => setSelected(plan.id)}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
