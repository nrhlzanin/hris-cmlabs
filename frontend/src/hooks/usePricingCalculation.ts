// Custom hook for real-time pricing calculations
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface PricingData {
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  processingFee: number;
  totalAmount: number;
  currency: string;
}

interface UsePricingCalculationProps {
  planId: string | null;
  billingPeriod: 'monthly' | 'yearly';
  quantity: number;
  enabled?: boolean;
}

export const usePricingCalculation = ({
  planId,
  billingPeriod,
  quantity,
  enabled = true
}: UsePricingCalculationProps) => {
  const [pricingData, setPricingData] = useState<PricingData>({
    unitPrice: 0,
    subtotal: 0,
    taxAmount: 0,
    processingFee: 0,
    totalAmount: 0,
    currency: 'IDR'
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePricing = async () => {
    if (!planId || !enabled || quantity < 1) return;
    
    setIsCalculating(true);
    setError(null);
    
    try {
      // Map frontend plan IDs to backend plan IDs
      const planIdMap: { [key: string]: string } = {
        'starter': '1',
        'lite': '2', 
        'pro': '3',
        'standard-seat': '4',
        'premium-seat': '5',
        'enterprise-seat': '6'
      };
      
      // For numeric IDs, use as-is, otherwise map from names
      const backendPlanId = planIdMap[planId] || planId;
      
      const response = await apiService.calculatePayment({
        plan_id: backendPlanId,
        billing_period: billingPeriod,
        quantity: quantity,
        payment_method_id: '1' // Default payment method for calculation
      });

      setPricingData({
        unitPrice: response.unit_price,
        subtotal: response.subtotal,
        taxAmount: response.tax_amount,
        processingFee: response.processing_fee,
        totalAmount: response.total_amount,
        currency: response.currency
      });
    } catch (error) {
      console.error('Failed to calculate pricing:', error);
      setError('Failed to calculate pricing. Please try again.');
      
      // For now, we'll keep the 0 values instead of fallback calculation
      // This ensures users see accurate pricing from the backend
    } finally {
      setIsCalculating(false);
    }
  };

  // Recalculate when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePricing();
    }, 300); // Debounce API calls

    return () => clearTimeout(timer);
  }, [planId, billingPeriod, quantity, enabled]);

  return {
    pricingData,
    isCalculating,
    error,
    recalculate: calculatePricing
  };
};
