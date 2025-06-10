// Types for pricing and payment system

export interface PlanFeature {
    name: string;
    included: boolean;
    limit?: string;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
        seat?: number;
    };
    currency: string;
    features: PlanFeature[];
    recommended?: boolean;
    popular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
}

export interface SeatPlan {
    id: string;
    name: string;
    description: string;
    pricePerSeat: number;
    currency: string;
    features: PlanFeature[];
    minSeats: number;
    maxSeats?: number;
    buttonText: string;
}

export type BillingPeriod = 'monthly' | 'yearly';
export type PlanType = 'package' | 'seat';

export interface CartItem {
    planId: string;
    planName: string;
    planType: PlanType;
    billingPeriod?: BillingPeriod;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'card' | 'bank' | 'digital_wallet';
    logo?: string;
    processing_fee?: number;
}

export interface BillingInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId?: string;
}

export interface PaymentData {
    paymentMethodId: string;
    billingInfo: BillingInfo;
    cartItem: CartItem;
    totalAmount: number;
    currency: string;
}
