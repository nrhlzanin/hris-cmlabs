/**
 * Session Timeout Warning Dialog Component
 * Displays a warning when session is about to expire
 */

'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface SessionTimeoutDialogProps {
  isOpen: boolean;
  timeRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
  formatTimeRemaining: () => string;
}

export default function SessionTimeoutDialog({
  isOpen,
  timeRemaining,
  onExtendSession,
  onLogout,
  formatTimeRemaining,
}: SessionTimeoutDialogProps) {
  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const isUrgent = minutes < 2;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        // Prevent closing by clicking outside or pressing escape
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-100' : 'bg-yellow-100'}`}>
              {isUrgent ? (
                <AlertTriangle className={`h-6 w-6 ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`} />
              ) : (
                <Clock className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <div>
              <DialogTitle className={`text-lg font-semibold ${isUrgent ? 'text-red-800' : 'text-yellow-800'}`}>
                Sesi Akan Berakhir
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Sesi Anda akan berakhir dalam {formatTimeRemaining()}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className={`p-4 rounded-lg border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p className="text-sm text-gray-700">
              {isUrgent ? (
                <>
                  <strong>Perhatian!</strong> Sesi Anda akan berakhir dalam waktu kurang dari 2 menit. 
                  Semua pekerjaan yang belum disimpan akan hilang.
                </>
              ) : (
                <>
                  Sesi Anda akan berakhir karena tidak ada aktivitas. 
                  Klik "Perpanjang Sesi" untuk melanjutkan bekerja atau "Logout" untuk keluar.
                </>
              )}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Waktu tersisa: <strong>{formatTimeRemaining()}</strong></span>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
          <Button
            onClick={onExtendSession}
            className={`${isUrgent 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Perpanjang Sesi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
