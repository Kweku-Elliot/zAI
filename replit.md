# Zenux AI Chat Application

## Overview

Zenux AI Chat is a modern full-stack chat application built with React and Express.js that combines AI-powered conversations with financial services integration. The application provides users with an intelligent chatbot interface while offering mobile money transactions, payment processing, and multi-platform deployment capabilities. The system features offline functionality, file processing, real-time chat, and a comprehensive credit system for managing AI usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: TailwindCSS with custom CSS variables for theming
- **State Management**: React Context API for application state and authentication
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Mobile Support**: Capacitor for native mobile app deployment
- **Responsive Design**: Mobile-first approach with safe area handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL schema definitions
- **Authentication**: Supabase Auth integration
- **File Handling**: Multer middleware for file uploads (10MB limit)
- **WebSocket**: Real-time communication support
- **API Design**: RESTful endpoints with OpenAI-compatible chat completions

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Drizzle ORM
- **Schema**: Comprehensive user, chat, message, transaction, and analytics tables
- **Offline Storage**: IndexedDB wrapper for local data persistence
- **File Storage**: Memory-based multer storage for file processing
- **Session Management**: Supabase for authentication state

### Authentication and Authorization
- **Provider**: Supabase Auth with JWT tokens
- **Methods**: Email/password, Google OAuth, GitHub OAuth
- **Session Handling**: Server-side session validation with service role key
- **Security**: Bearer token authentication for API requests

### AI Integration Architecture
- **Primary Service**: ZenuxAI API integration with enhanced conversation features
- **Fallback**: OpenAI GPT-5 API support
- **Features**: Per-user memory, conversation threading, file analysis, image generation
- **Offline AI**: Lightweight transaction validation using client-side algorithms
- **Context Management**: Enhanced v2 system for conversation continuity

### Credit and Usage System
- **Plans**: Free, Plus, Pro, ProPlus tiers with different limits
- **Tracking**: AI credits, voice minutes, file uploads, image generation, API calls
- **Enforcement**: Real-time usage validation and limit enforcement
- **Analytics**: Per-user usage tracking and analytics dashboard

### Mobile Money and Payments
- **Payment Gateway**: Paystack integration for Ghana Cedis (GHS)
- **Mobile Money**: MTN MOMO and Vodafone Cash API integration
- **Bill Payments**: Support for data bundles, airtime, and utility bills
- **Wallet System**: Internal credit system with transaction history

## External Dependencies

### Third-Party Services
- **Supabase**: Authentication, user management, and session handling
- **Paystack**: Payment processing for Ghana market (GHS transactions)
- **ZenuxAI API**: Primary AI service with enhanced conversation features
- **OpenAI API**: Backup AI service (GPT-5 model support)
- **MTN MOMO API**: Mobile money transactions
- **Vodafone Cash API**: Alternative mobile money provider

### Development and Deployment Tools
- **Vercel**: Recommended hosting platform for full-stack deployment
- **Capacitor**: Native mobile app compilation for iOS and Android
- **Replit**: Development environment support with specialized plugins

### Key Libraries and Frameworks
- **React Query (@tanstack/react-query)**: Server state management and caching
- **Radix UI**: Accessible component primitives for UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **WebSocket (ws)**: Real-time bidirectional communication
- **QR Code Libraries**: QR generation and scanning for wallet functionality
- **Multer**: File upload handling middleware

### Database and Storage
- **PostgreSQL**: Primary database (configurable with Neon or other providers)
- **IndexedDB**: Client-side offline storage for messages and app data
- **Environment Configuration**: Support for development and production environments

### Security and Encryption
- **Post-Quantum Cryptography**: Mock implementation for future-proofing
- **JWT**: Token-based authentication via Supabase
- **CORS**: Cross-origin request handling for API security
- **Input Validation**: Zod schema validation for API endpoints