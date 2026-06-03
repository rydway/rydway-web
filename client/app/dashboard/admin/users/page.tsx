"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/admin/useAdmin";
import { User } from "@/types/models";
import { Loader2, MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
  const { users, isLoading, updateUserStatus, isUpdatingStatus } = useAdminUsers();
  const [actingOn, setActingOn] = useState<string | null>(null);

  const handleToggleSuspend = async (user: User) => {
    setActingOn(user.id);
    try {
      const newActive = !user.isActive;
      await updateUserStatus({ id: user.id, isActive: newActive });
    } finally {
      setActingOn(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
        <p className="text-slate-500 font-secondary mt-1">View and manage all registered platform users.</p>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-950 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  {!user.isActive ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{user.kycStatus || 'Unsubmitted'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => handleToggleSuspend(user)}
                        disabled={isUpdatingStatus && actingOn === user.id}
                        className={!user.isActive ? "text-green-600" : "text-red-600"}
                      >
                        {isUpdatingStatus && actingOn === user.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : !user.isActive ? (
                          <ShieldCheck className="mr-2 h-4 w-4" />
                        ) : (
                          <ShieldAlert className="mr-2 h-4 w-4" />
                        )}
                        {!user.isActive ? 'Unsuspend User' : 'Suspend User'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
