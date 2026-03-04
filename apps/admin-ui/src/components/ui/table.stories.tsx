import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { mockTransactions } from '../../mocks/story-data';
import { Badge } from './badge';

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  }
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="rounded-md border p-4 bg-card">
      <Table>
        <TableCaption>A list of recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((txn) => (
            <TableRow key={txn.id}>
              <TableCell className="font-medium">{txn.id}</TableCell>
              <TableCell>
                <Badge variant={txn.status === 'Completed' ? 'default' : txn.status === 'Failed' ? 'destructive' : 'secondary'}>
                  {txn.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right text-foreground">
                {txn.amount >= 0 ? '+' : ''}{txn.amount} {txn.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
