"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download } from "lucide-react";
import { format } from "date-fns";
import { PayoutHistoryItem } from "./types";

interface PayoutHistoryTableProps {
  payouts: PayoutHistoryItem[];
  formatCurrency: (val: number) => string;
}

export function PayoutHistoryTable({ payouts, formatCurrency }: PayoutHistoryTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm font-secondary">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
              Payout History
            </CardTitle>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium text-slate-500">Reference</TableHead>
                <TableHead className="text-xs font-medium text-slate-500">Date</TableHead>
                <TableHead className="text-xs font-medium text-slate-500">Amount</TableHead>
                <TableHead className="text-xs font-medium text-slate-500">Method</TableHead>
                <TableHead className="text-xs font-medium text-slate-500">Account</TableHead>
                <TableHead className="text-xs font-medium text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id} className="hover:bg-slate-50">
                  <TableCell className="text-xs font-mono text-slate-500">{payout.reference}</TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {format(new Date(payout.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-slate-800">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{payout.method}</TableCell>
                  <TableCell className="text-sm text-slate-600">{payout.account}</TableCell>
                  <TableCell>
                    <Badge variant="green" className="bg-green-50 text-green-700 border-green-200">
                      {payout.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
