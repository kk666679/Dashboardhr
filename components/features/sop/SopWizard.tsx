'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  department: z.string().min(1, 'Department is required').max(100),
  category: z.enum(['POLICY', 'OPERATIONAL', 'COMPLIANCE', 'EMERGENCY']),
  processDescription: z.string().min(1, 'Process description is required').max(2000),
  title: z.string().max(200).optional(),
  prompt: z.string().max(5000).optional(),
  policyText: z.string().max(5000).optional(),
  regulationText: z.string().max(5000).optional(),
  meetingNotes: z.string().max(5000).optional(),
  processMap: z.string().max(5000).optional(),
  extractedPdfText: z.string().max(5000).optional(),
});

type SopFormValues = z.infer<typeof formSchema>;

export default function SopWizard() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<SopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'OPERATIONAL',
    },
  });

  const mutation = trpc.sop.generate.useMutation({
    onSuccess: (data) => {
      router.push(`/automation/sops/${data.id}`);
    },
    onError: (error) => {
      setServerError(error.message || 'SOP generation failed');
    },
  });

  const { data: systemMode } = trpc.sop.getSystemMode.useQuery();

  const watchFields = watch(['prompt', 'policyText', 'regulationText', 'meetingNotes', 'processMap', 'extractedPdfText']);
  const hasOptionalInput = watchFields.some((value) => (value ?? '').trim().length > 0);

  async function onSubmit(values: SopFormValues) {
    setServerError(null);
    mutation.mutate(values);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create SOP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {systemMode?.mode === 'offline' ? (
            <Alert>
              <AlertTitle>Offline mode</AlertTitle>
              <AlertDescription>AI-enhanced generation is unavailable. The document will be template-based.</AlertDescription>
            </Alert>
          ) : null}

          {serverError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to generate SOP</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="HR, Operations, Compliance" {...register('department')} />
                {errors.department ? <p className="text-sm text-red-600">{errors.department.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="OPERATIONAL" onValueChange={(value) => setValue('category', value as SopFormValues['category'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POLICY">Policy</SelectItem>
                    <SelectItem value="OPERATIONAL">Operational</SelectItem>
                    <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category ? <p className="text-sm text-red-600">{errors.category.message}</p> : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">SOP title</Label>
              <Input id="title" placeholder="Optional title" {...register('title')} />
              {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="processDescription">Process description</Label>
              <Textarea id="processDescription" rows={6} placeholder="Describe the process to document" {...register('processDescription')} />
              {errors.processDescription ? <p className="text-sm text-red-600">{errors.processDescription.message}</p> : null}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="text-sm font-medium">Optional input sources</div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea id="prompt" rows={3} placeholder="Additional guidance or brief" {...register('prompt')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyText">Policy text</Label>
                  <Textarea id="policyText" rows={3} placeholder="Relevant policy text" {...register('policyText')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regulationText">Regulation text</Label>
                  <Textarea id="regulationText" rows={3} placeholder="Regulatory text to align with" {...register('regulationText')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingNotes">Meeting notes</Label>
                  <Textarea id="meetingNotes" rows={3} placeholder="Notes from the process review" {...register('meetingNotes')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processMap">Process map</Label>
                  <Textarea id="processMap" rows={3} placeholder="Describe the workflow steps" {...register('processMap')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extractedPdfText">Extracted PDF text</Label>
                  <Textarea id="extractedPdfText" rows={3} placeholder="Paste extracted text from documents" {...register('extractedPdfText')} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending ? 'Generating…' : 'Generate SOP'}
              </Button>
              {hasOptionalInput ? <span className="text-sm text-muted-foreground">Optional inputs detected.</span> : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
