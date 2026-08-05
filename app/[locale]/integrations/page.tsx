"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IntegrationKanbanBoard } from "@/components/features/integrations/IntegrationKanbanBoard";

import { Zap } from "lucide-react";

export default function IntegrationCenterPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Integration Center</h1>
            <p className="text-muted-foreground">
              Connect Malaysian government systems and enterprise platforms using a config-driven integration hub.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">Kanban</Badge>
            <Button asChild variant="secondary">
              <Link href="/docs/INTEGRATIONS" prefetch={false}>
                Documentation <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <IntegrationKanbanBoard />
    </div>
  );
}
