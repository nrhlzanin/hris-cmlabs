'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PAYMENT_METHODS, PACKAGE_PLANS, CURRENCIES, TAX_RATE } from '../config';
import { PaymentMethod, BillingInfo, CartItem, PaymentData } from '../types';

export default function PaymentPage() {
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

  // Load cart data from localStorage or URL params
  useEffect(() => {
    // Try to get cart data from localStorage (from choose-lite/choose-pro pages)
    const savedCartData = localStorage.getItem('hris-cart-data');
    if (savedCartData) {
      try {
        const cartData = JSON.parse(savedCartData);
        setCartItem(cartData);
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
          const cartData: CartItem = {
            planId: plan.id,
            planName: plan.name,
            planType: 'package',
            billingPeriod: billingPeriod || 'monthly',
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
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
      unitPrice: 15,
      totalPrice: 15,
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
    if (!cartItem) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = cartItem.totalPrice;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !cartItem) return;

    const paymentData: PaymentData = {
      paymentMethodId: selectedPaymentMethod,
      billingInfo,
      cartItem,
      totalAmount: calculateTotals().total,
      currency: 'USD',
    };

    console.log('Processing payment:', paymentData);
    
    // Simulate payment processing
    setIsProcessing(true);
    
    // Here you would integrate with your payment processor
    setTimeout(() => {
      setIsProcessing(false);
      
      // Create order data for confirmation page
      const orderData = {
        cartItems: [cartItem],
        paymentData: {
          paymentMethod: selectedPaymentMethodData?.name || 'Credit Card',
          billingInfo
        },
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        totalAmount: calculateTotals().total
      };
      
      // Store order data for confirmation page
      localStorage.setItem('completedOrder', JSON.stringify(orderData));
      
      // Clear cart data
      localStorage.removeItem('cartData');
      localStorage.removeItem('selectedPlan');
      
      // Redirect to confirmation page
      window.location.href = '/plans/confirmation';
    }, 2000); // Simulate 2 second processing time
  };

  const selectedPaymentMethodData = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod);
  const { subtotal, tax, total } = calculateTotals();

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
                  {/* Credit Cards */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Credit & Debit Cards</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.filter(method => method.type === 'card').map((method) => (
                        <label
                          key={method.id}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-8 h-8 mr-3 bg-gray-100 rounded flex items-center justify-center">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      // Fallback to text if image fails to load
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <span className="text-xs font-medium text-gray-600">
                                  {method.name.substring(0, 4).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{method.name}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Banks */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Bank Transfer</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.filter(method => method.type === 'bank').map((method) => (
                        <label
                          key={method.id}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-8 h-8 mr-3 bg-blue-100 rounded flex items-center justify-center">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <span className="text-xs font-medium text-blue-600">
                                  {method.name.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">{method.name}</span>
                                {method.processing_fee && (
                                  <span className="text-xs text-gray-500">
                                    Processing fee: Rp {method.processing_fee.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Digital Wallets */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Digital Wallets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.filter(method => method.type === 'digital_wallet').map((method) => (
                        <label
                          key={method.id}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="w-8 h-8 mr-3 bg-green-100 rounded flex items-center justify-center">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <span className="text-xs font-medium text-green-600">
                                  {method.name.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">{method.name}</span>
                                {method.processing_fee && (
                                  <span className="text-xs text-gray-500">
                                    Processing fee: Rp {method.processing_fee.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isProcessing 
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
                    `Complete Payment - $${total.toFixed(2)}`
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
                      {cartItem.billingPeriod} billing • {cartItem.quantity} user{cartItem.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">${cartItem.totalPrice.toFixed(2)}</span>
                </div>

                {selectedPaymentMethodData?.processing_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processing Fee</span>
                    <span className="text-sm text-gray-900">
                      Rp {selectedPaymentMethodData.processing_fee.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Tax (11%)</span>
                    <span className="text-sm text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">What's included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All {cartItem.planName} features</li>
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
    </div>
  );
}
