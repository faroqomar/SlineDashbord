'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UpdatePlatformFeeSettingsBodySchema } from '@sline/shared';
import { financeApi } from '../services/finance_api';

/** Form schema: shared body + coerce for number input from form. */
const PlatformFeeEditSchema = UpdatePlatformFeeSettingsBodySchema.extend({
  fee_rate_default_bps: z.coerce.number().int().min(0).max(10000),
});
type PlatformFeeEditValues = z.infer<typeof PlatformFeeEditSchema>;

interface PlatformFeeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBps: number;
  maxBps: number;
  onSuccess: () => void;
}

export function PlatformFeeEditDialog({
  open,
  onOpenChange,
  currentBps,
  maxBps,
  onSuccess,
}: PlatformFeeEditDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PlatformFeeEditValues>({
    resolver: zodResolver(PlatformFeeEditSchema),
    defaultValues: {
      fee_rate_default_bps: currentBps,
      reason: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ fee_rate_default_bps: currentBps, reason: '' });
      setError(null);
    }
  }, [open, currentBps, form]);

  const onSubmit = async (values: PlatformFeeEditValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await financeApi.updateFeeSettings({
        fee_rate_default_bps: values.fee_rate_default_bps,
        reason: values.reason.trim(),
      });
      onSuccess();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update fee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Update platform fee rate</DialogTitle>
          <DialogDescription>
            New rate applies only to future lock points (booking escrow, direct offer accept, task award). Already locked entities keep their rate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fee_rate_default_bps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee rate (basis points)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={10000}
                      placeholder="1000 = 10%"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {(field.value / 100).toFixed(1)}% · Max {maxBps / 100}%
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (required)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Quarterly fee adjustment" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? ' Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
