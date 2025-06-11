'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PAYMENT_METHODS, PACKAGE_PLANS, CURRENCIES, TAX_RATE } from '../config-minimal';
import { PaymentMethod, BillingInfo, CartItem, PaymentData } from '../types';
import { usePaymentMethods } from '@/hooks/usePlans';
import {
  SuccessPopup,
  ErrorPopup,
  ValidationPopup,
  LoadingPopup,
  ConfirmationPopup,
  WarningPopup,
  InfoPopup,
} from '@/components/ui/popups';

export default function PaymentPage() {
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia',
    taxId: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Load cart data from localStorage or URL params
  useEffect(() => {
    // Try to get cart data from localStorage (from choose-lite/choose-pro pages)
    const savedCartData = localStorage.getItem('cartData');
    if (savedCartData) {
      try {
        const cartData = JSON.parse(savedCartData);
        // Handle array format (legacy) or single item
        const cartItem = Array.isArray(cartData) ? cartData[0] : cartData;
        setCartItem(cartItem);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        // Fall back to URL params or mock data
        setMockCartItem();
      }
    } else {
      // Check URL params for plan data
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get('plan');
      const billingPeriod = urlParams.get('billing') as 'monthly' | 'yearly';
      const employeeCount = urlParams.get('employees');
      
      if (planId) {
        const plan = PACKAGE_PLANS.find(p => p.id === planId);
        if (plan) {
          const quantity = employeeCount ? parseInt(employeeCount) : 1;
          const unitPrice = billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly;
          const subtotal = unitPrice * quantity;
          const tax = Math.round(subtotal * TAX_RATE);
          const cartData: CartItem = {
            planId: plan.id,
            planName: plan.name,
            planType: 'package',
            billingPeriod: billingPeriod || 'monthly',
            quantity,
            unitPrice,
            totalPrice: subtotal + tax,
          };
          setCartItem(cartData);
        } else {
          setMockCartItem();
        }
      } else {
        setMockCartItem();
      }
    }
  }, []);

  const setMockCartItem = () => {
    // Fallback mock cart item for demonstration
    const mockCartItem: CartItem = {
      planId: 'lite',
      planName: 'Lite Plan',
      planType: 'package',
      billingPeriod: 'monthly',
      quantity: 1,
      unitPrice: 25000,
      totalPrice: 27750, // Including 11% tax (25000 * 1.11)
    };
    setCartItem(mockCartItem);
  };

  const handleBillingInfoChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!billingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!billingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!billingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.state.trim()) newErrors.state = 'State is required';
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!selectedPaymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (billingInfo.email && !emailRegex.test(billingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    if (!cartItem) return { subtotal: 0, tax: 0, total: 0, processingFee: 0, finalTotal: 0 };
    
    // cartItem.totalPrice already includes tax from choose pages
    const total = cartItem.totalPrice;
    const subtotal = Math.round(total / (1 + TAX_RATE));
    const tax = total - subtotal;
      // Add processing fee if payment method is selected
    const selectedPaymentMethodData = paymentMethods.find(method => method.id === selectedPaymentMethod);
    const processingFee = selectedPaymentMethodData?.processing_fee || 0;
    const finalTotal = total + processingFee;
    
    return { subtotal, tax, total, processingFee, finalTotal };
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Immediate check for payment method
    if (!selectedPaymentMethod) {
      alert('Please select a payment method before continuing.');
      return;
    }
    
    // First validate the form and show validation popup if errors exist
    if (!validateForm() || !cartItem) {
      const errorList: string[] = [];
      
      if (!billingInfo.firstName.trim()) errorList.push("First name is required");
      if (!billingInfo.lastName.trim()) errorList.push("Last name is required");
      if (!billingInfo.email.trim()) errorList.push("Email address is required");
      if (!billingInfo.phone.trim()) errorList.push("Phone number is required");
      if (!billingInfo.address.trim()) errorList.push("Address is required");
      if (!billingInfo.city.trim()) errorList.push("City is required");
      if (!billingInfo.state.trim()) errorList.push("State/Province is required");
      if (!billingInfo.zipCode.trim()) errorList.push("ZIP/Postal code is required");
      if (!selectedPaymentMethod) errorList.push("Please select a payment method");
      
      if (billingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
        errorList.push("Please enter a valid email address");
      }
      
      setValidationErrors(errorList);
      setShowValidationPopup(true);
      return;
    }const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    const totals = calculateTotals();
    
    // Set payment data for confirmation popup
    setPaymentData({
      planName: cartItem.planName,
      quantity: cartItem.planType === 'seat' ? `${cartItem.quantity} seats` : `${cartItem.quantity} employees`,
      total: `Rp ${totals.finalTotal.toLocaleString('id-ID')}`,
      paymentMethod: selectedMethod?.name || 'Unknown Method'
    });

    // Show confirmation popup before processing payment
    setShowConfirmationPopup(true);
  };

  // Function to actually process the payment after confirmation
  const processPayment = () => {
    setShowConfirmationPopup(false);
    setShowLoadingPopup(true);
    setIsProcessing(true);
    
    const paymentData: PaymentData = {
      paymentMethodId: selectedPaymentMethod,
      billingInfo,
      cartItem: cartItem!,
      totalAmount: calculateTotals().finalTotal,
      currency: 'IDR',
    };

    console.log('Processing payment:', paymentData);
    
    // Simulate payment processing with different outcomes
    setTimeout(() => {
      setShowLoadingPopup(false);
      setIsProcessing(false);
      
      // Simulate random success/failure for demo (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {        // Success: Create order data for confirmation page
        const selectedPaymentMethodData = paymentMethods.find(method => method.id === selectedPaymentMethod);
        const orderData = {
          cartItems: [cartItem!],
          paymentData: {
            paymentMethod: selectedPaymentMethodData?.name || 'Credit Card',
            billingInfo
          },
          orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          totalAmount: calculateTotals().finalTotal
        };
        
        // Store order data for confirmation page
        localStorage.setItem('completedOrder', JSON.stringify(orderData));
        
        // Clear cart data
        localStorage.removeItem('cartData');
        localStorage.removeItem('selectedPlan');
        
        // Show success popup with order details
        setPaymentData({
          ...paymentData,
          orderId: orderData.orderId,
          amount: `Rp ${orderData.totalAmount.toLocaleString('id-ID')}`
        });
        setShowSuccessPopup(true);
      } else {
        // Error: Show error popup
        setShowErrorPopup(true);
      }
    }, 3000); // Simulate 3 second processing time
  };

  // Popup event handlers
  const handleSuccessPopupContinue = () => {
    setShowSuccessPopup(false);
    // Navigate to confirmation page
    window.location.href = '/plans/confirmation';
  };

  const handleErrorPopupRetry = () => {
    setShowErrorPopup(false);
    // Allow user to try payment again
    processPayment();
  };

  const handleErrorPopupCancel = () => {
    setShowErrorPopup(false);
    // User can modify their information and try again
  };

  const handleValidationPopupClose = () => {
    setShowValidationPopup(false);
    // Clear validation errors
    setValidationErrors([]);
  };

  // Demo functions for testing other popups
  const showWarningDemo = () => {
    setShowWarningPopup(true);
  };

  const showInfoDemo = () => {
    setShowInfoPopup(true);
  };
  const selectedPaymentMethodData = paymentMethods.find(method => method.id === selectedPaymentMethod);
  const { subtotal, tax, total, processingFee, finalTotal } = calculateTotals();

  if (!cartItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h1>
          <Link href="/plans/pricing-plans" className="text-blue-600 hover:text-blue-800">
            Go back to pricing plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/plans/pricing-plans" className="text-gray-500 hover:text-gray-700">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Payment</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Secure checkout powered by industry-leading encryption</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.firstName}
                      onChange={(e) => handleBillingInfoChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.lastName}
                      onChange={(e) => handleBillingInfoChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => handleBillingInfoChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => handleBillingInfoChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingInfo.company}
                      onChange={(e) => handleBillingInfoChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.address}
                      onChange={(e) => handleBillingInfoChange('address', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your street address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) => handleBillingInfoChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) => handleBillingInfoChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your state or province"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) => handleBillingInfoChange('zipCode', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your ZIP or postal code"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => handleBillingInfoChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="United States">United States</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingInfo.taxId}
                      onChange={(e) => handleBillingInfoChange('taxId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your tax ID or VAT number"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mb-4">{errors.paymentMethod}</p>
                )}

                <div className="space-y-4">
                  {/* Credit Cards */}                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Credit & Debit Cards</h3>                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.filter(method => method.type === 'card').map((method) => (
                        <div
                          key={method.id}
                          onClick={() => {
                            console.log('Credit card clicked:', method.id);
                            setSelectedPaymentMethod(method.id);
                          }}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-12 h-8 mr-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={48}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallbackSpan = target.nextElementSibling as HTMLElement;
                                      if (fallbackSpan) fallbackSpan.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <span 
                                  className="text-xs font-medium text-gray-600"
                                  style={{ display: method.logo ? 'none' : 'block' }}
                                >
                                  {method.name.substring(0, 4).toUpperCase()}
                                </span>
                              </div>                              <span className="text-sm font-medium text-gray-900">{method.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPaymentMethod === method.id 
                                ? 'border-blue-500 bg-blue-500 shadow-md' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                          {/* Hidden radio input for form submission */}
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => {}} // Handled by div onClick
                            className="sr-only"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Banks */}                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Bank Transfer</h3>                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.filter(method => method.type === 'bank').map((method) => (
                        <div
                          key={method.id}
                          onClick={() => {
                            console.log('Bank method clicked:', method.id);
                            setSelectedPaymentMethod(method.id);
                          }}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-12 h-8 mr-3 bg-blue-100 rounded flex items-center justify-center overflow-hidden">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={48}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallbackSpan = target.nextElementSibling as HTMLElement;
                                      if (fallbackSpan) fallbackSpan.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <span 
                                  className="text-xs font-medium text-blue-600"
                                  style={{ display: method.logo ? 'none' : 'block' }}
                                >
                                  {method.name.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">{method.name}</span>                                {method.processing_fee && (
                                  <span className="text-xs text-gray-500">
                                    Processing fee: Rp {method.processing_fee.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPaymentMethod === method.id 
                                ? 'border-blue-500 bg-blue-500 shadow-md' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                          {/* Hidden radio input for form submission */}
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => {}} // Handled by div onClick
                            className="sr-only"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Digital Wallets */}<div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Digital Wallets</h3>                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.filter(method => method.type === 'digital_wallet').map((method) => (
                        <div
                          key={method.id}
                          onClick={() => {
                            console.log('Digital wallet clicked:', method.id);
                            setSelectedPaymentMethod(method.id);
                          }}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-12 h-8 mr-3 bg-green-100 rounded flex items-center justify-center overflow-hidden">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={48}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallbackSpan = target.nextElementSibling as HTMLElement;
                                      if (fallbackSpan) fallbackSpan.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <span 
                                  className="text-xs font-medium text-green-600"
                                  style={{ display: method.logo ? 'none' : 'block' }}
                                >
                                  {method.name.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">{method.name}</span>
                                {method.processing_fee && (
                                  <span className="text-xs text-gray-500">
                                    Processing fee: Rp {method.processing_fee.toLocaleString('id-ID')}
                                  </span>
                                )}                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPaymentMethod === method.id 
                                ? 'border-blue-500 bg-blue-500 shadow-md' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                          {/* Hidden radio input for form submission */}
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => {}} // Handled by div onClick
                            className="sr-only"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {!selectedPaymentMethod && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm font-medium">
                      ⚠️ Please select a payment method to continue
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isProcessing || !selectedPaymentMethod}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isProcessing || !selectedPaymentMethod
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Payment - Rp ${finalTotal.toLocaleString('id-ID')}`
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{cartItem.planName}</h3>
                    <p className="text-sm text-gray-500">
                      {cartItem.planType === 'seat' 
                        ? `${cartItem.quantity} seat${cartItem.quantity > 1 ? 's' : ''} • Monthly billing`
                        : `${cartItem.billingPeriod} billing • ${cartItem.quantity} user${cartItem.quantity > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">Rp {Math.round(cartItem.totalPrice / (1 + TAX_RATE)).toLocaleString('id-ID')}</span>
                </div>

                {selectedPaymentMethodData?.processing_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processing Fee ({selectedPaymentMethodData.name})</span>
                    <span className="text-sm text-gray-900">
                      Rp {selectedPaymentMethodData.processing_fee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Tax (11%)</span>
                    <span className="text-sm text-gray-900">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  {processingFee > 0 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Processing Fee</span>
                      <span className="text-sm text-gray-900">Rp {processingFee.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 text-lg">Rp {finalTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">What's included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All {cartItem.planName} features</li>
                    {cartItem.planType === 'seat' ? (
                      <>
                        <li>• Per-seat monthly billing</li>
                        <li>• Easy seat management</li>
                        <li>• Flexible scaling</li>
                      </>
                    ) : (
                      <>
                        <li>• {cartItem.billingPeriod === 'yearly' ? 'Annual billing discount' : 'Monthly flexibility'}</li>
                        <li>• Support for {cartItem.quantity} employee{cartItem.quantity > 1 ? 's' : ''}</li>
                      </>
                    )}
                    <li>• Priority email support</li>
                    <li>• 99.9% uptime guarantee</li>
                    <li>• 30-day money back guarantee</li>
                  </ul>
                </div>

                <div className="text-center pt-4">
                  <Link 
                    href="/plans/pricing-plans" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    ← Back to pricing plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Components */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          window.location.href = '/plans/confirmation';
        }}
        onConfirm={() => {
          setShowSuccessPopup(false);
          window.location.href = '/plans/confirmation';
        }}
        title="Payment Successful!"
        message="Your payment has been processed successfully. Thank you for upgrading your HRIS plan!"
        confirmText="View Details"
        data={paymentData}
      />

      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        onConfirm={() => {
          setShowErrorPopup(false);
          // Allow user to try again
        }}
        title="Payment Failed"
        message="We're sorry, but your payment could not be processed. Please check your payment details and try again."
        confirmText="Try Again"
        cancelText="Cancel"
      />

      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        title="Missing Required Information"
        message="Please fill in all required fields before proceeding with your payment."
        confirmText="OK"
        errors={validationErrors}
      />

      <LoadingPopup
        isOpen={showLoadingPopup}
        title="Processing Payment"
        message="Please wait while we securely process your payment. This may take a few seconds..."
      />

      <ConfirmationPopup
        isOpen={showConfirmationPopup}
        onClose={() => setShowConfirmationPopup(false)}
        onConfirm={processPayment}
        title="Confirm Payment"
        message="Please review your order details and confirm your payment."
        confirmText="Confirm Payment"
        cancelText="Cancel"
        data={paymentData}
      />

      <WarningPopup
        isOpen={showWarningPopup}
        onClose={() => setShowWarningPopup(false)}
        onConfirm={() => setShowWarningPopup(false)}
        title="Warning"
        message="Please review your information before proceeding."
        confirmText="Continue"
        cancelText="Cancel"
      />

      <InfoPopup
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        title="Information"
        message="Here's some important information for you."
        confirmText="OK"
      />
    </div>
  );
}
