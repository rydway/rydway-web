"use client";

import { Users, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supportTeamMembers } from "./supportTeamData";

export function SupportTeam() {
  return (
    <Card className="border-border shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent font-secondary">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-foreground">Our Support Team</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          We're here to help you 24/7. Our dedicated support team is always ready to assist you with any questions or issues.
        </p>
        <div className="flex -space-x-2 overflow-hidden mb-4">
          {supportTeamMembers.map((member) => (
            <div key={member.name} className="relative">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:text-blue-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span 
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-1 ring-white bg-emerald-500/100"
              />
            </div>
          ))}
          <div className="h-10 w-10 rounded-full bg-muted border-2 border-white flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">+3</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
          Average response time: 15 minutes
        </div>
      </CardContent>
    </Card>
  );
}
