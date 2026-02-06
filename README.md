# samaan-merchant — Merchant Web App (Next.js)

Merchant-facing web app for **Samaan** (manage products/inventory, view orders, update order status).

## Live
- **Merchant App:** https://lemon-moss-0d0bd3010.6.azurestaticapps.net

## Related Repositories
- **Backend API:** https://github.com/adityaakunjir/samaan-api
- **Customer App:** https://github.com/adityaakunjir/samaan-customer
- **Portfolio Repo:** https://github.com/adityaakunjir/Samaan

## Tech Stack
- Next.js (React), TypeScript
- REST API integration with `samaan-api`
- Azure Static Web Apps

## Features
- JWT authentication (Merchant)
- Product management (CRUD)
- Inventory/availability updates
- Merchant orders list + order status updates

## Local Setup
### Prerequisites
- Node.js 18+ (recommended)

### Configure
Set the API base URL:

```bash
NEXT_PUBLIC_API_URL=https://samaan-api.azurewebsites.net/api
```

### Run
```bash
npm install
npm run dev
```

## Deployment
Deployed on **Azure Static Web Apps**.
