# Madagascar Driving License Learning Platform

## Overview

This is a bilingual (French/Malagasy) educational platform designed to help users in Madagascar prepare for their driving license exam. The application provides interactive lessons, practice questions, and mock exams across six categories of driving knowledge: road signs, traffic rules, road safety, vehicle mechanics, priorities, and parking.

The platform features a student-facing interface for learning and testing, plus an admin panel for content management. It supports dark/light themes, text-to-speech functionality for accessibility, and tracks exam results to help users monitor their progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter - a lightweight client-side router handling navigation between home, category lessons, exams, admin panel, and 404 pages.

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. The design system follows a "new-york" style variant with custom color tokens and spacing primitives defined in the Tailwind configuration.

**State Management**: 
- React Query (@tanstack/react-query) for server state management and API data caching
- React Context API for global UI state (theme and language preferences)
- Local component state for UI interactions

**Design System**: Material Design-inspired approach with educational platform influences (Duolingo, Khan Academy). Uses a consistent typography hierarchy with Inter for UI elements and Merriweather for lesson content. Implements an elevation system using subtle shadows and hover states.

**Key Features**:
- Bilingual support (French/Malagasy) with context-based translations
- Dark/light theme switching with localStorage persistence
- Text-to-speech integration using Web Speech API
- Responsive layout with mobile-first approach
- Interactive exam interface with timer and progress tracking

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with the following resource structure:
- `/api/categories` - CRUD operations for learning categories
- `/api/lessons/category/:id` - Lessons grouped by category
- `/api/questions/category/:id` - Practice questions by category
- `/api/exam-results` - Exam submission and retrieval

**Request Handling**: 
- JSON body parsing with raw body preservation for potential webhook integrations
- Request logging middleware tracking method, path, status, duration, and response preview
- Error handling with appropriate HTTP status codes

**Development Server**: Vite middleware integration for HMR (Hot Module Replacement) in development, with production serving of static files from the built client.

### Data Storage

**ORM**: Drizzle ORM for type-safe database operations and schema management.

**Database**: PostgreSQL (via Neon serverless driver) with WebSocket support for connection pooling.

**Schema Design**:
- `categories` - Top-level groupings (road signs, traffic rules, etc.) with bilingual names and icon identifiers
- `lessons` - Educational content with French/Malagasy text, optional images, and ordering
- `questions` - Multiple-choice quiz questions (4 options) with bilingual content and correct answer tracking
- `exam_results` - Stores user performance including score, pass/fail status, and answer history

**Data Relationships**: Categories have one-to-many relationships with both lessons and questions. Cascade deletes ensure referential integrity when categories are removed.

**Migration Strategy**: Drizzle Kit handles schema migrations with PostgreSQL dialect, outputting to a `/migrations` directory.

### Authentication and Authorization

Currently, the application does not implement user authentication or authorization. The admin panel is accessible without credentials, and exam results are not tied to specific user accounts. This represents a future enhancement opportunity for multi-user support and progress tracking.

### External Dependencies

**UI Component Libraries**:
- Radix UI - Accessible, unstyled component primitives for complex interactions (dialogs, dropdowns, accordions, etc.)
- Lucide React - Icon library providing consistent iconography
- Embla Carousel - Touch-friendly carousel component
- cmdk - Command palette component for potential keyboard navigation

**Styling**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe variant management for components
- tailwind-merge & clsx - Conditional className composition utilities

**Form Management**:
- React Hook Form - Performant form state management
- Zod - Schema validation with TypeScript type inference
- @hookform/resolvers - Integration between React Hook Form and Zod

**Database & Backend**:
- @neondatabase/serverless - Serverless Postgres driver optimized for edge/serverless environments
- ws - WebSocket library for database connection management
- connect-pg-simple - PostgreSQL session store (imported but session management not yet implemented)
- Drizzle ORM & Drizzle Zod - Database ORM with Zod schema generation

**Date Handling**: date-fns for consistent date formatting and manipulation.

**Build Tools**:
- Vite - Fast build tool and dev server with HMR
- esbuild - JavaScript bundler for production server code
- TypeScript - Type safety across the entire application

**Development Tooling**:
- @replit/vite-plugin-runtime-error-modal - Development error overlay
- @replit/vite-plugin-cartographer - Code navigation assistance (Replit-specific)
- tsx - TypeScript execution for development server

**Assets**: Generated images stored in `/attached_assets/generated_images/` referenced throughout lessons and questions for visual learning aids.