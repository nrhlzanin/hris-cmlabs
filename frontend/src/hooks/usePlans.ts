// Hook for plans data fetching and management
import { usePlansContext } from '@/contexts/PlansContext';

export const usePlans = () => {
  const { packagePlans, seatPlans, loading, error, usingApi, refetch } = usePlansContext();
  
  return {
    packagePlans,
    seatPlans,
    loading,
    error,
    usingApi,
    refetch,
  };
};

export const usePaymentMethods = () => {
  const { paymentMethods, loading, error, usingApi } = usePlansContext();
  
  return {
    paymentMethods,
    loading,
    error,
    usingApi,
  };
};
