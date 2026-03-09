# Marv's Abbey Road Shop

Vinyl e-commerce storefront built with React + Vite + Supabase, now wired for PayMongo checkout.

## Stack
- Frontend: React, TypeScript, Vite, Tailwind
- Backend services: Supabase (DB/Auth/Storage)
- Payments: PayMongo Checkout Sessions
- Deployment: Vercel

## PayMongo Flow
1. Frontend checkout page calls `POST /api/create-paymongo-checkout`.
2. Server validates stock and computes totals from DB values.
3. Server creates `orders` row with `pending` payment status.
4. Server creates PayMongo checkout session and returns `checkout_url`.
5. Frontend redirects customer to PayMongo hosted checkout page.
6. PayMongo webhook calls `POST /api/paymongo-webhook`.
7. Webhook marks orders as `paid`/`failed` and updates order status.

## API Endpoints
- `api/create-paymongo-checkout.ts`
- `api/paymongo-webhook.ts`

## Environment Variables
Use `.env.example` as baseline:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYMONGO_SECRET_KEY`
- `PAYMONGO_WEBHOOK_SECRET`
- `PAYMONGO_PAYMENT_METHOD_TYPES` (example: `card,gcash`)
- `APP_BASE_URL` (example: `https://your-domain.com`)

## Local Development
- `npm run dev` runs Vite frontend only.
- Vercel serverless API routes (`/api/*`) are not served by Vite.
- To test checkout API locally, run with Vercel dev tooling so `/api/*` is available.

## Build
```bash
npm run build
```
