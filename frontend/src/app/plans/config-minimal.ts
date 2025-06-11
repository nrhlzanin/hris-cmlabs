// Configuration for pricing plans - MINIMAL FALLBACK VERSION
// This serves as emergency fallback when API is unavailable

import { Plan, SeatPlan, PaymentMethod } from './types';

// MINIMAL FALLBACK DATA - Only essential for emergency
export const FALLBACK_PACKAGE_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with HRIS',
    price: { monthly: 0, yearly: 0 },
    currency: 'USD',
    features: [
      { name: 'Basic HRIS features', included: true },
      { name: 'Up to 10 employees', included: true },
      { name: 'Email support', included: true },
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
  },
  {
    id: 'lite',
    name: 'Lite',
    description: 'Ideal for growing teams',
    price: { monthly: 25000, yearly: 20000 },
    currency: 'IDR',
    features: [
      { name: 'All Starter features', included: true },
      { name: 'Up to 50 employees', included: true },
      { name: 'Advanced features', included: true },
    ],
    recommended: true,
    buttonText: 'Upgrade Plan',
    buttonVariant: 'primary',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For enterprises',
    price: { monthly: 75000, yearly: 70000 },
    currency: 'IDR',
    features: [
      { name: 'All Lite features', included: true },
      { name: 'Unlimited employees', included: true },
      { name: 'Enterprise features', included: true },
    ],
    popular: true,
    buttonText: 'Upgrade Plan',
    buttonVariant: 'primary',
  },
];

export const FALLBACK_SEAT_PLANS: SeatPlan[] = [
  {
    id: 'standard-seat',
    name: 'Standard Seat',
    description: 'Basic access for individual team members',
    pricePerSeat: 5000,
    currency: 'IDR',
    minSeats: 1,
    maxSeats: 100,
    features: [
      { name: 'Basic time tracking', included: true },
      { name: 'Personal dashboard', included: true },
      { name: 'Leave requests', included: true },
    ],
    buttonText: 'Select Seats',
  },
  {
    id: 'premium-seat',
    name: 'Premium Seat',
    description: 'Enhanced access with advanced features',
    pricePerSeat: 10000,
    currency: 'IDR',
    minSeats: 1,
    maxSeats: 100,
    features: [
      { name: 'All Standard features', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'Priority support', included: true },
    ],
    buttonText: 'Select Seats',
  },
  {
    id: 'enterprise-seat',
    name: 'Enterprise Seat',
    description: 'Full feature access for power users',
    pricePerSeat: 15000,
    currency: 'IDR',
    minSeats: 1,
    features: [
      { name: 'All Premium features', included: true },
      { name: 'Full feature access', included: true },
      { name: 'Dedicated support', included: true },
    ],
    buttonText: 'Select Seats',
  },
];

// Payment methods can stay local since they don't change often
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'visa',
    name: 'Visa',
    type: 'card',
    logo: '/img/payment/visa.svg',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    type: 'card',
    logo: '/img/payment/mastercard.svg',
  },
  {
    id: 'bca',
    name: 'Bank Central Asia (BCA)',
    type: 'bank',
    logo: '/img/payment/bca.svg',
    processing_fee: 2500,
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    type: 'bank',
    logo: '/img/payment/mandiri.svg',
    processing_fee: 2500,
  },
  {
    id: 'bni',
    name: 'Bank Negara Indonesia (BNI)',
    type: 'bank',
    logo: '/img/payment/bni.svg',
    processing_fee: 2500,
  },
  {
    id: 'gopay',
    name: 'GoPay',
    type: 'digital_wallet',
    logo: '/img/payment/gopay.svg',
    processing_fee: 1000,
  },
  {
    id: 'dana',
    name: 'DANA',
    type: 'digital_wallet',
    logo: '/img/payment/dana.svg',
    processing_fee: 1000,
  },
  {
    id: 'ovo',
    name: 'OVO',
    type: 'digital_wallet',
    logo: '/img/payment/ovo.svg',
    processing_fee: 1000,
  },
];

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
};

export const TAX_RATE = 0.11; // 11% VAT for Indonesia

// Legacy exports for backward compatibility
export const PACKAGE_PLANS = FALLBACK_PACKAGE_PLANS;
export const SEAT_PLANS = FALLBACK_SEAT_PLANS;
