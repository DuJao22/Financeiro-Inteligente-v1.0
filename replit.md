# Overview

Financeiro Inteligente is a comprehensive SaaS financial management system designed for freelancers and small businesses. The application provides complete financial control with features including cash flow management, accounts payable/receivable, intelligent reports, subscription management with trial periods, and integration capabilities. Built with Flask, it offers a modern web interface with responsive design and focuses on providing professional-grade financial tools for small business owners.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Flask with SQLAlchemy ORM for database operations
- **Authentication**: Flask-Login for user session management with password hashing using Werkzeug
- **Database**: PostgreSQL as primary database with SQLAlchemy migrations via Flask-Migrate
- **Application Structure**: Modular blueprint-based architecture with separate modules for authentication, dashboard, financial management, reports, and subscription handling

## Frontend Architecture
- **Templating**: Jinja2 templating engine with base template inheritance
- **Styling**: TailwindCSS for responsive design with custom CSS for 3D effects and animations
- **JavaScript**: Vanilla JavaScript with modular organization (app.js, dashboard.js, financial.js)
- **UI Components**: Bootstrap Icons for iconography, Chart.js for data visualization
- **Responsive Design**: Mobile-first approach with Progressive Web App (PWA) capabilities

## Data Model Design
- **User Management**: User model with subscription tracking, trial period management, and plan feature access control
- **Financial Entities**: Transaction model for income/expense tracking, Account model for payables/receivables
- **Subscription System**: Built-in subscription management with trial periods, plan limits, and feature gating

## Security & Authentication
- **Password Security**: Werkzeug password hashing with secure session management
- **Access Control**: Decorator-based route protection with subscription-level feature gating
- **Session Management**: Flask session handling with configurable secret keys

## Business Logic
- **Subscription Tiers**: Three-tier subscription model (MEI, Professional, Enterprise) with feature differentiation
- **Trial System**: 7-day free trial with automatic feature limitation post-expiration
- **Financial Calculations**: Real-time balance calculations, monthly summaries, and KPI generation
- **Plan Limits**: Transaction limits and feature restrictions based on subscription tier

# External Dependencies

## Core Framework Dependencies
- **Flask**: Main web framework with SQLAlchemy, Login, and Migrate extensions
- **PostgreSQL**: Primary database system (configurable via DATABASE_URL environment variable)
- **Werkzeug**: WSGI utilities and security features including ProxyFix middleware

## Frontend Libraries
- **TailwindCSS**: Utility-first CSS framework loaded via CDN
- **Bootstrap Icons**: Icon library for UI components
- **Chart.js**: JavaScript charting library for financial data visualization

## Payment Integration
- **Mercado Pago**: Payment gateway integration for subscription billing and automated payment processing (implementation references in templates)

## Development & Deployment
- **Environment Configuration**: Environment variable based configuration for database URLs and session secrets
- **Database Migrations**: Flask-Migrate for database schema versioning
- **Proxy Support**: ProxyFix middleware for reverse proxy deployments

## Planned Integrations
- **Email/WhatsApp**: Notification services for account alerts and reminders
- **OCR Services**: Intelligent receipt processing for automated transaction entry
- **AI Chatbot**: Financial advisory chatbot integration
- **Accounting Software**: Integration capabilities for external accounting systems