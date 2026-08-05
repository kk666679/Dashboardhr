import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const schema = z.object({
  caseId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(["Scheduled", "Held", "Cancelled", "Postponed"]),
  attendees: z.string().optional(), // comma separated
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface HearingFormProps {
  hearingId?: string;
  onSuccess?: () => void;
}

export function HearingForm({ hearingId, onSuccess }: HearingFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { data: existing } = trpc.industrialRelations.getCase.useQuery(
    { id: hearingId! },
    { enabled: !!hearingId }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: {
      caseId: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      location: "",
      status: "Scheduled",
      attendees: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        caseId: existing.caseId,
        date: existing.date.split("T")[0],
        time: existing.time,
        location: existing.location,
        status: existing.status,
        attendees: existing.attendees?.join(", ") || "",
        notes: existing.notes || "",
      });
    }
  }, [existing, form]);

  const { mutate: save, isPending } = trpc.industrialRelations.createCase.useMutation({
    onSuccess: () => {
      toast({ title: "Hearing scheduled" });
      utils.industrialRelations.listCases.invalidate();
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const onSubmit = (values: FormValues) => {
    save({
      type: "Others",
      description: `Hearing: ${values.caseId} at ${values.location} on ${values.date}`,
      subjectId: values.caseId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="caseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Held">Held</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Postponed">Postponed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attendees (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe, Jane Smith" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : existing ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
