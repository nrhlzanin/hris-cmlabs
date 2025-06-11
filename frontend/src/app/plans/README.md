# HRIS Plans & Payment System

This document outlines the complete backend/frontend separation for the HRIS pricing and payment system.

## Architecture Overview

### Backend (Laravel + Supabase)
- **Database**: PostgreSQL via Supabase
- **Models**: Plan, PaymentMethod, Subscription, Order
- **Controllers**: PlanController, PaymentController, SubscriptionController, OrderController
- **API Routes**: RESTful endpoints for plans, payments, and subscriptions

### Frontend (Next.js)
- **Pages**: Pricing plans, plan selection, payment processing, confirmation
- **Context**: PlansProvider for centralized data management
- **Hooks**: usePlans, usePaymentMethods for data fetching
- **Services**: API service with fallback to local config
- **Components**: Popup system for user feedback

## Database Structure

### Plans Table
```sql
- id (primary key)
- name (string)
- description (text)
- type (enum: package, seat)
- monthly_price (decimal)
- yearly_price (decimal)
- seat_price (decimal)
- currency (string)
- features (json)
- is_recommended (boolean)
- is_popular (boolean)
- button_text (string)
- button_variant (string)
- min_seats (integer)
- max_seats (integer)
- is_active (boolean)
```

### Payment Methods Table
```sql
- id (primary key)
- name (string)
- type (enum: card, bank, digital_wallet)
- logo (string)
- processing_fee (decimal)
- is_active (boolean)
```

### Orders Table
```sql
- id (primary key)
- order_id (string, unique)
- user_id (foreign key to users.id_users)
- plan_id (foreign key to plans.id)
- payment_method_id (foreign key to payment_methods.id)
- billing_period (enum: monthly, yearly)
- quantity (integer)
- unit_price (decimal)
- subtotal (decimal)
- tax_amount (decimal)
- processing_fee (decimal)
- total_amount (decimal)
- currency (string)
- billing_info (json)
- status (enum: pending, completed, failed, cancelled)
- processed_at (timestamp)
```

### Subscriptions Table
```sql
- id (primary key)
- user_id (foreign key to users.id_users)
- plan_id (foreign key to plans.id)
- billing_period (enum: monthly, yearly)
- quantity (integer)
- unit_price (decimal)
- total_price (decimal)
- currency (string)
- status (enum: active, cancelled, expired, pending)
- starts_at (timestamp)
- ends_at (timestamp)
- cancelled_at (timestamp)
```

## API Endpoints

### Plans
- `GET /api/plans` - Get all active plans (package and seat-based)
- `GET /api/plans/{id}` - Get specific plan details
- `POST /api/plans` - Create new plan (admin only)
- `PUT /api/plans/{id}` - Update plan (admin only)
- `DELETE /api/plans/{id}` - Deactivate plan (admin only)

### Payment Methods
- `GET /api/payment-methods` - Get all active payment methods

### Payment Processing
- `POST /api/payment/calculate` - Calculate pricing for a plan
- `POST /api/payment/process` - Process payment and create order
- `GET /api/payment/order/{orderId}` - Get order details

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `GET /api/subscriptions/{id}` - Get specific subscription
- `POST /api/subscriptions/{id}/cancel` - Cancel subscription

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get specific order

## Frontend Pages

### 1. Pricing Plans (`/plans/pricing-plans`)
- Toggle between package and seat-based plans
- Shows API connection status
- Handles fallback to local data

### 2. Plan Selection Pages
- `/plans/choose-lite` - Lite plan configuration
- `/plans/choose-pro` - Pro plan configuration
- `/plans/choose-seats/standard` - Standard seat selection
- `/plans/choose-seats/premium` - Premium seat selection
- `/plans/choose-seats/enterprise` - Enterprise seat selection

### 3. Payment Page (`/plans/payment`)
- Billing information form
- Payment method selection
- Order summary
- Payment processing with popups

### 4. Confirmation Page (`/plans/confirmation`)
- Order confirmation details
- Payment receipt

## Key Features

### Hybrid Data Loading
- **Primary**: Fetch from backend API
- **Fallback**: Use local configuration data
- **Status Indicator**: Shows API connection status
- **Retry Option**: Button to retry API connection

### Payment Processing
- Real-time price calculation
- Tax calculation (11% VAT)
- Processing fee handling
- Multiple payment methods (cards, banks, digital wallets)

### User Experience
- Loading states
- Error handling with popups
- Form validation
- Responsive design
- Success/failure feedback

## Setup Instructions

### Backend
1. Run migrations: `php artisan migrate`
2. Run seeders: `php artisan db:seed --class=PlansSeeder && php artisan db:seed --class=PaymentMethodsSeeder`
3. Start server: `php artisan serve --port=8000`

### Frontend
1. Install dependencies: `npm install`
2. Set environment: Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Start development: `npm run dev`

## Data Flow

1. **Page Load**: PlansProvider attempts to fetch from API
2. **API Success**: Uses backend data, shows "Connected" status
3. **API Failure**: Falls back to local config, shows warning with retry option
4. **Plan Selection**: Stores plan data in localStorage
5. **Payment Processing**: Sends data to backend API or simulates locally
6. **Confirmation**: Displays order details and receipt

## Error Handling

- Network failures gracefully fallback to local data
- Form validation with user-friendly error messages
- Payment processing errors handled with retry options
- Loading states prevent user confusion

This architecture ensures the system works both with and without backend connectivity, providing a robust user experience while maintaining proper separation of concerns.
