
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

  ##Basic interface for prototype
  <img width="852" alt="Screenshot 1946-11-27 at 7 21 58 AM" src="https://github.com/user-attachments/assets/f21b7f2e-7fd7-4b58-9f7e-8ed3c1e45e57" />
<img width="776" alt="Screenshot 1946-11-27 at 7 20 36 AM" src="https://github.com/user-attachments/assets/0d042347-1def-48d0-ba55-c55887178940" />


#feature prototype images
<img width="896" alt="Screenshot 1946-11-27 at 6 45 28 AM" src="https://github.com/user-attachments/assets/a541c2c5-0286-488c-8e71-86f4e1118a0c" />
<img width="875" alt="Screenshot 1946-11-27 at 7 06 13 AM" src="https://github.com/user-attachments/assets/edc45375-34ac-473c-9ab1-99eed7dd5874" />
<img width="747" alt="Screenshot 1946-11-27 at 7 12 52 AM" src="https://github.com/user-attachments/assets/550befcd-f74f-4b0f-aafb-663fe00eda9e" />


## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
└── shared/          # Shared TypeScript types and schemas
```

## License

MIT
