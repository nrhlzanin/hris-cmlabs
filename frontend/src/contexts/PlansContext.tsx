// Data provider for plans - handles both API and fallback local data
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Plan, SeatPlan, PaymentMethod } from '@/app/plans/types';
import { PACKAGE_PLANS, SEAT_PLANS, PAYMENT_METHODS } from '@/app/plans/config-minimal';
import { apiService } from '@/services/api';

interface PlansContextType {
  packagePlans: Plan[];
  seatPlans: SeatPlan[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  usingApi: boolean;
  refetch: () => void;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export const usePlansContext = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlansContext must be used within a PlansProvider');
  }
  return context;
};

interface PlansProviderProps {
  children: ReactNode;
}

export const PlansProvider = ({ children }: PlansProviderProps) => {
  const [packagePlans, setPackagePlans] = useState<Plan[]>([]);
  const [seatPlans, setSeatPlans] = useState<SeatPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingApi, setUsingApi] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      const [plansData, paymentMethodsData] = await Promise.all([
        apiService.getPlans(),
        apiService.getPaymentMethods()
      ]);

      // Transform API data to match frontend interface
      const transformedPackagePlans = (plansData.package_plans || []).map((plan: any) => ({
        id: plan.name ? plan.name.toLowerCase() : (plan.id ? plan.id.toString() : `plan-${Math.random()}`),
        name: plan.name || 'Unknown Plan',
        description: plan.description || '',
        price: {
          monthly: Number(plan.monthly_price) || 0,
          yearly: Number(plan.yearly_price) || 0,
          seat: plan.seat_price ? Number(plan.seat_price) : undefined
        },
        currency: plan.currency || 'IDR',
        features: Array.isArray(plan.features) ? plan.features : [],
        recommended: Boolean(plan.is_recommended),
        popular: Boolean(plan.is_popular),
        buttonText: plan.button_text || 'Select Plan',
        buttonVariant: (['primary', 'secondary', 'outline'].includes(plan.button_variant) 
          ? plan.button_variant 
          : 'primary') as 'primary' | 'secondary' | 'outline'
      }));

      const transformedSeatPlans = (plansData.seat_plans || []).map((plan: any) => ({
        id: plan.name ? `${plan.name.toLowerCase().replace(/\s+/g, '-')}-seat` : (plan.id ? plan.id.toString() : `seat-${Math.random()}`),
        name: plan.name || 'Unknown Plan',
        description: plan.description || '',
        pricePerSeat: Number(plan.seat_price) || 0,
        currency: plan.currency || 'IDR',
        features: Array.isArray(plan.features) ? plan.features : [],
        minSeats: Number(plan.min_seats) || 1,
        maxSeats: plan.max_seats ? Number(plan.max_seats) : undefined,
        buttonText: plan.button_text || 'Select Plan'
      }));

      setPackagePlans(transformedPackagePlans);
      setSeatPlans(transformedSeatPlans);
      
      // Merge API payment methods with local logo data
      const allPaymentMethods = [
        ...paymentMethodsData.cards,
        ...paymentMethodsData.banks,
        ...paymentMethodsData.digital_wallets
      ];
      
      // Map API payment methods with local logos
      const paymentMethodsWithLogos = allPaymentMethods.map((apiMethod: any) => {
        // Find matching local payment method for logo
        const localMethod = PAYMENT_METHODS.find(local => 
          local.name.toLowerCase().includes(apiMethod.name.toLowerCase()) ||
          apiMethod.name.toLowerCase().includes(local.name.toLowerCase()) ||
          local.id === apiMethod.id
        );
        
        return {
          id: apiMethod.id || localMethod?.id || `method-${Math.random()}`,
          name: apiMethod.name || localMethod?.name || 'Unknown Method',
          type: apiMethod.type || localMethod?.type || 'card',
          logo: localMethod?.logo ?? undefined, // Use local logo path, ensure undefined not null
          processing_fee: Number(apiMethod.processing_fee) || localMethod?.processing_fee || 0
        };
      });
      
      setPaymentMethods(paymentMethodsWithLogos);
      
      setUsingApi(true);
      console.log('✅ Successfully loaded data from API');
      
    } catch (err) {
      console.warn('⚠️ API unavailable, using local data:', err);
      
      // Fallback to local data
      setPackagePlans(PACKAGE_PLANS);
      setSeatPlans(SEAT_PLANS);
      setPaymentMethods(PAYMENT_METHODS);
      setUsingApi(false);
      setError('Using local data - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const value: PlansContextType = {
    packagePlans,
    seatPlans,
    paymentMethods,
    loading,
    error,
    usingApi,
    refetch: loadData,
  };

  return (
    <PlansContext.Provider value={value}>
      {children}
    </PlansContext.Provider>
  );
};
