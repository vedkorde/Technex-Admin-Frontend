# TECHNEX-26 Admin Dashboard (Next.js)

A separate role-based Next.js admin frontend built for the uploaded **event-admin-backend-fixed.zip** API. It does not directly connect to Google Sheets or Supabase from the browser: the backend handles both.

## Features

- Email/password login and refresh through backend `/api/auth`.
- Super Admin: all events, analytics, all coordinator accounts.
- Overall Coordinator: all events, analytics, and management of event coordinators they created.
- Event Coordinator: only the single event assigned by the backend; no account management.
- Overview: totals, event bars, daily trends, colleges, UTR checks.
- Event performance, server-side filtered/paginated registration table, CSV export, manual sync.
- Create, edit, disable/enable, reassign, reset password and delete permitted coordinator accounts.
- Responsive dark/gold design, no additional UI libraries or external charting APIs.

## Run locally

1. Extract this folder next to (not inside) the backend folder.
2. Open terminal in `technex-admin-frontend`.
3. `npm install`
4. Copy `.env.example` to `.env.local`.
5. Set `NEXT_PUBLIC_ADMIN_API_URL=http://localhost:4000` (no `/api`).
6. Start the corrected backend separately on port 4000 with valid Google Sheets and Supabase credentials. Seed Super Admin in backend first.
7. In frontend run `npm run dev`.
8. Open `http://localhost:3000` and sign in.

Backend `.env` must include `CORS_ORIGINS=http://localhost:3000` (and production frontend origin when deployed). Google Sheets should be **one spreadsheet with a separate tab for each event**. Event coordinator assignments must match the tab name exactly.

## Deployment

- Deploy backend on Railway and set its environment variables. The backend must use `GOOGLE_SERVICE_ACCOUNT_BASE64` or a securely mounted credentials file; never commit JSON keys.
- Deploy this frontend on Vercel. Set `NEXT_PUBLIC_ADMIN_API_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app`.
- Update backend `CORS_ORIGINS` to include your exact Vercel domain and/or `https://admin.yourdomain.com`, comma-separated if supported by backend config.
- This is a standalone admin app. To serve it under an existing website `/admin` path, configure a reverse proxy/rewrite to this deployment; don't just copy the files into the public site's `app/admin` without adapting routing.

## Security / scope

- **Backend authorization is authoritative.** The UI never grants access; `/api` validates Supabase tokens and scopes registrations and exports per request.
- Tokens are held in **sessionStorage** for this starter. For a production deployment with sensitive student contact data, prefer an audited same-origin BFF with HttpOnly Secure SameSite cookies and CSRF protection, plus MFA, access logging and a strict CSP.
- Treat UTR `submitted` as **unverified**; a submitted payment reference is not proof of successful payment. Amounts shown are Sheet-recorded values, not trusted payment confirmations.
- Frontend does not edit registrations, modify payment statuses, or send passwords by email.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY`, Google service-account keys or backend admin secrets to Next.js `NEXT_PUBLIC_` variables.
- Registration searches support exact `college`, `branch`, and `year` filters because that is how the uploaded backend implements them.
- The frontend has not been tested against live Google Sheets or Supabase because credentials were not supplied.
