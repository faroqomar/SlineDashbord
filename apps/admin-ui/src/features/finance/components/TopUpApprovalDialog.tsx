'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  TopUpApprovalFormSchema,
  type TopUpApprovalFormValues,
} from '../models/top-up-request.schema';
import { useTopUpApprovalVM } from '../viewmodels/useTopUpApproval.vm';

interface TopUpApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (approvalId: string) => void;
}

export function TopUpApprovalDialog({ open, onOpenChange, onCreated }: TopUpApprovalDialogProps) {
  const vm = useTopUpApprovalVM();
  const form = useForm<TopUpApprovalFormValues>({
    resolver: zodResolver(TopUpApprovalFormSchema),
    defaultValues: {
      targetUserId: '',
      amountCents: 100000,
      reason: '',
    },
  });

  const handleSubmit = async (values: TopUpApprovalFormValues) => {
    try {
      const row = await vm.requestTopUpApproval(values);
      onCreated?.(row.id);
      form.reset({
        targetUserId: values.targetUserId,
        amountCents: 100000,
        reason: '',
      });
      onOpenChange(false);
    } catch {
      // Error state is handled in the VM and surfaced in dialog body.
    }
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (vm.isSubmitting) return;
    if (!nextOpen) vm.clearError();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Top-up Approval Request</DialogTitle>
          <DialogDescription>
            This creates an approval request for a wallet adjustment. No funds are moved from this dialog.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="targetUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (cents)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Why this top-up is required" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {vm.error && <p className="text-sm font-medium text-destructive">{vm.error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={vm.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={vm.isSubmitting}>
                {vm.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Approval
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
