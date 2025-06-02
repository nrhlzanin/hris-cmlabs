# HRIS - CMLABS

This is a fullstack Human Resource Information System project using:

- **Frontend**: Next.js (in `/frontend`)
- **Backend**: Laravel (in `/backend`)

## How to Run

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
