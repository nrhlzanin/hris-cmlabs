"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// SVG Icons
const CheckCircleIcon = () => (
  <svg
    className="w-12 h-12 text-green-600 mx-auto mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon = () => (
  <svg
    className="w-12 h-12 text-red-600 mx-auto mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ExclamationIcon = () => (
  <svg
    className="w-12 h-12 text-yellow-600 mx-auto mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mx-auto mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LoadingIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// Popup Types
export interface PopupProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  data?: any;
}

// Success Popup - Payment Successful
export const SuccessPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Payment Successful!",
  message = "Your payment has been processed successfully.",
  confirmText = "Continue",
  data,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <CheckCircleIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
            {data?.orderId && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Order ID:</strong> {data.orderId}
                </p>
                {data?.amount && (
                  <p className="text-sm text-green-800">
                    <strong>Amount:</strong> {data.amount}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm || onClose} className="w-full">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Error/Cancelled Popup 
export const ErrorPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Payment Failed",
  message = "Your payment could not be processed. Please try again.",
  confirmText = "Try Again",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <XCircleIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={onConfirm || onClose} className="flex-1">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Validation Error Popup - Missing Required Fields
export const ValidationPopup: React.FC<PopupProps & { errors?: string[] }> = ({
  isOpen,
  onClose,
  title = "Missing Required Fields",
  message = "Please fill in all required fields before proceeding.",
  confirmText = "OK",
  errors = [],
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <ExclamationIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="warning">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Loading Popup - Processing Payment
export const LoadingPopup: React.FC<PopupProps> = ({
  isOpen,
  title = "Processing Payment",
  message = "Please wait while we process your payment...",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md font-inter" hideCloseButton>
        <DialogHeader>
          <div className="text-center">
            <LoadingIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// Confirmation Popup - Before Payment
export const ConfirmationPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Payment",
  message = "Are you sure you want to proceed with this payment?",
  confirmText = "Confirm Payment",
  cancelText = "Cancel",
  data,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <InfoIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
            {data && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                {data.planName && (
                  <p className="text-sm text-blue-800">
                    <strong>Plan:</strong> {data.planName}
                  </p>
                )}
                {data.quantity && (
                  <p className="text-sm text-blue-800">
                    <strong>Quantity:</strong> {data.quantity}
                  </p>
                )}
                {data.total && (
                  <p className="text-sm text-blue-800">
                    <strong>Total:</strong> {data.total}
                  </p>
                )}
                {data.paymentMethod && (
                  <p className="text-sm text-blue-800">
                    <strong>Payment Method:</strong> {data.paymentMethod}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Warning Popup - Generic Warning
export const WarningPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Warning",
  message = "Please review your information before proceeding.",
  confirmText = "Continue",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <ExclamationIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={onConfirm || onClose} className="flex-1">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Info Popup - General Information
export const InfoPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title = "Information",
  message = "Here's some important information for you.",
  confirmText = "OK",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-inter">
        <DialogHeader>
          <div className="text-center">
            <InfoIcon />
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export all popup components
export {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationIcon,
  InfoIcon,
  LoadingIcon,
};
