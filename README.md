# Money Manager Frontend

React frontend for the Money Manager application built with Vite and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional - uses Vite proxy by default):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

### Home Page
- Financial overview with income, expe    and balance
- Account balances display
- Recent transactions list
- Floating "Add" button for quick transaction creation

### Dashboard
- Period selector (Weekly, Monthly, Yearly)
- Summary cards for income, expenses, and balance
- Bar chart showing income vs expenses over time
- Recent transactions with filtering
- Filter by division, category, and date range

### Transactions
- Full transaction history
- Filter by type (Income, Expense, Transfer)
- Filter by division, category, and date range
- Pagination support
- Edit and delete transactions (within 12 hours)

### Summary
- Category-wise breakdown of income and expenses
- Progress bars showing relative amounts
- Net savings calculation
- Filter by period, division, and date range

### Accounts
- Account balance cards (Cash, Bank, Wallet)
- Total balance display
- Account distribution table
- Transfer between accounts

## Transaction Modal

Supports three transaction types:
- **Income** (Green): Add money to an account
- **Expense** (Red): Deduct money from an account  
- **Transfer** (Blue): Move money between accounts

### Required Fields
- Amount
- Date and time
- Description
- Category (for income/expense)
- Division (Personal/Office for income/expense)
- Account

## Edit Restriction

Transactions can only be edited within 12 hours of creation. After that, they are locked and display a "Locked" indicator.

## Build

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AccountCard.jsx
│   ├── Chart.jsx
│   ├── FilterBar.jsx
│   ├── Layout.jsx
│   ├── SummaryCard.jsx
│   ├── TransactionList.jsx
│   └── TransactionModal.jsx
├── context/
│   └── AppContext.jsx
├── pages/
│   ├── Accounts.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Summary.jsx
│   └── Transactions.jsx
├── services/
│   └── api.js
├── App.jsx
├── index.css
└── main.jsx
```
