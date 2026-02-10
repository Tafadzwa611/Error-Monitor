
# Error Analytics Dashboard

A full-stack error analytics solution that monitors Gmail for specific system alerts, parses them into a structured database (Firestore), and visualizes the health of your tasks and services.

## Features
- **Gmail IMAP Sync**: Connects to `marambatanaka@gmail.com` to fetch error alerts.
- **Intelligent Parsing**: Automatically extracts Task IDs, Entity types, and Log filenames from email content.
- **Firebase Backend**: Real-time storage of error logs.
- **Interactive Visualization**: Recharts integration for trend analysis and distribution.
- **Automatic Refresh**: Dashboard updates every 5 minutes.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Netlify Functions (Node.js)
- **Database**: Firebase Firestore

## Setup
1. `npm install`
2. Deploy to Netlify or run `netlify dev` locally.
3. The Firebase and Gmail credentials are baked into the code as requested, but ideally should move to `.env` for production.

## Error Parsing Rules
The system parses four specific types:
1. **Celery Task Failure**: Extracts task name, ID, and base entity.
2. **Loan Balances Check**: Extracts associated log file.
3. **Installments Check**: Extracts associated log file.
4. **System Error**: Extracts HTTP status codes and endpoint paths.
