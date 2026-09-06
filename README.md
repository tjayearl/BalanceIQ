# 📊 BalanceIQ

BalanceIQ is a modern personal finance management web application designed to help users understand, organize, and take control of their finances with clarity and confidence.

The app allows users to track expenses, manage debts, prepare for taxes, and monitor their overall financial health through a clean, intuitive dashboard. Instead of juggling spreadsheets or complex finance tools, BalanceIQ brings everything into one simple and intelligent platform.

Built with a mobile-friendly, user-focused design, BalanceIQ makes financial management accessible to everyone — from students and freelancers to professionals looking for better control over their money. Security, simplicity, and usability are at the core of the experience, ensuring users can focus on making smarter financial decisions without unnecessary stress.

## ✨ Key Features

- Expense tracking with clear categorization
- Debt management with balances and due dates
- Interactive financial dashboard
- Tax organization and preparation tools
- Customizable user settings and notifications
- Secure authentication and data handling
- Fully responsive design for mobile, tablet, and desktop

## Credits

Special thanks to **Gemini AI** and **ChatGPT** for their assistance with error handling and guidance in creating a secure and compliant application.

## Local development

The repository contains the Vite frontend and a FastAPI backend under `backend/`.

### Frontend

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` in `.env.local` when the backend is not running on its default local port.

### Backend

Create a project-local Python environment and install the backend dependencies:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\python -m pip install -r backend\requirements.txt
copy backend\.env.example backend\.env
backend\.venv\Scripts\python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

The local fallback database is SQLite. Production should use a managed PostgreSQL database by setting `DATABASE_URL`.

## Deployment

The backend is configured as a Render Web Service through [backend/render.yaml](backend/render.yaml). Render must provide `DATABASE_URL` and a generated `JWT_SECRET`. Set `CORS_ORIGINS` to the exact Vercel frontend origin and local development origin.

The Vercel frontend must define `VITE_API_BASE_URL` as the deployed Render backend URL at build time. Do not commit `.env` or production secrets.
