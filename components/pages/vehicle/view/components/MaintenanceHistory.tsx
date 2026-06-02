"use client";

import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRecord } from "./types";

export function MaintenanceHistory({ history }: { history?: MaintenanceRecord[] }) {
  if (!history || history.length === 0) return null;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          Maintenance History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant={
                      record.type === 'service' ? 'blue' : 
                      record.type === 'repair' ? 'amber' : 
                      'purple'
                    }
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {record.type}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {new Date(record.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 mb-1">{record.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-600">By: {record.completedBy}</span>
                  <span className="text-slate-600">Cost: ₦{record.cost.toLocaleString()}</span>
                  {record.nextDue && (
                    <span className="text-amber-600">Next due: {new Date(record.nextDue).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
