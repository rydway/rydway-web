"use client";

import { Award, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VehicleFeatures({ features }: { features: string[] }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Features & Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {features.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No specific features listed.</p>
        )}
      </CardContent>
    </Card>
  );
}
