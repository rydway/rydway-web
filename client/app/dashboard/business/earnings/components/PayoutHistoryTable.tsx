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
    <Card className="border-border shadow-sm font-secondary">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold text-foreground font-primary">
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
                <TableHead className="text-xs font-medium text-muted-foreground">Reference</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Amount</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Method</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-mono text-muted-foreground">{payout.reference}</TableCell>
                  <TableCell className="text-sm text-foreground">
                    {format(new Date(payout.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-foreground">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payout.method}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payout.account}</TableCell>
                  <TableCell>
                    <Badge variant="green" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
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
