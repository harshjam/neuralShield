
# SecureBank

A secure banking application built with React, Express, and TypeScript featuring multi-layered security verification for high-value transactions.

## Features

- User authentication with secure session management
- Transaction history tracking
- Enhanced security for high-value transfers
- Biometric verification for large transactions
- Real-time fraud detection
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **Security**: Multi-factor verification, AI-based fraud detection

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## Security Features

- Basic OTP verification for transactions under ₹1 lakh
- Enhanced security with biometric verification for high-value transfers
- AI-powered fraud detection system
- Secure session management
- Input validation and sanitization

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
└── shared/          # Shared TypeScript types and schemas
```

## License

MIT
