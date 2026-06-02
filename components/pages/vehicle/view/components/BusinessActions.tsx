"use client";

import { useState } from "react";
import { Edit, Ban, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VehicleDetails } from "./types";

interface BusinessActionsProps {
  vehicle: VehicleDetails;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export function BusinessActions({ 
  vehicle, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: BusinessActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="space-y-3">
      {onEdit && (
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Vehicle
        </Button>
      )}
      
      {onToggleStatus && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onToggleStatus}
        >
          {vehicle.status === 'available' ? (
            <>
              <Ban className="h-4 w-4 mr-2" />
              Mark as Unavailable
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Available
            </>
          )}
        </Button>
      )}
      
      {onDelete && (
        <>
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Vehicle
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-primary">Delete Vehicle</AlertDialogTitle>
                <AlertDialogDescription className="font-secondary">
                  Are you sure you want to delete {vehicle.name}? This action cannot be undone
                  and will remove all associated bookings and data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    onDelete();
                    setShowDeleteDialog(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-xs"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
