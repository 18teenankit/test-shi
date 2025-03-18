# Shivanshi Enterprises Website - Project Notes

## Project Overview
This project is a comprehensive website for Shivanshi Enterprises, a chemical and compound distribution company based in India. The website serves as both a customer-facing platform for showcasing products and services, and an administrative system for managing website content.

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter (lightweight router)
- **State Management**: React Query for data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Theming**: Dark/Light mode support
- **PWA Support**: Service Worker, manifest.json

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Passport.js with local strategy
- **Session Management**: express-session with connect-session-sequelize
- **Database**: In-memory storage with file persistence (data.json)
- **File Uploads**: multer

### SEO & Performance
- **Meta Tags**: Comprehensive metadata including Open Graph and Twitter cards
- **Structured Data**: JSON-LD for Organization, LocalBusiness, and Product data
- **Progressive Web App**: Full offline support, installable on devices
- **Sitemap & Robots.txt**: For search engine crawling

## Pages & Features

### Public Pages
1. **Home**: Main landing page with hero slider and featured products
2. **About**: Company information, mission, vision, and values
3. **Contact**: Contact form with WhatsApp integration
4. **Products**: List of all products
5. **Category/{id}**: Products filtered by category
6. **Product/{id}**: Detailed product information
7. **Legal Pages**: Privacy Policy and Terms of Service

### Admin Pages (Protected)
1. **Dashboard**: Overview and stats
2. **Products**: Manage product listings
3. **Categories**: Manage product categories
4. **Hero Images**: Manage homepage slider images
5. **Contact Requests**: View and manage customer inquiries
6. **Settings**: Website configuration
7. **Users**: Manage admin users

## Key Features
- **Multi-language Support**: English and Hindi
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme toggle
- **PWA Capabilities**: Offline functionality, installable app
- **Real-time Form Validation**: Using Zod and React Hook Form
- **SEO Optimization**: Meta tags, structured data, canonical URLs
- **WhatsApp Integration**: Direct messaging for customer inquiries
- **Content Management**: Full admin control over website content
- **Image Management**: Upload and manage images for products and sliders

## Security Measures
- **Authentication**: Password hashing with bcrypt
- **Session Management**: Secure HTTP-only cookies
- **CSRF Protection**: Express built-in protections
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: All inputs validated with Zod schema
- **Role-based Access Control**: Super admin and manager roles

## File Structure

### Client
- `/src/pages/` - Page components
- `/src/components/` - Reusable UI components
- `/src/components/SEO/` - SEO-related components
- `/src/components/ui/` - UI library components
- `/src/components/sections/` - Page sections
- `/src/components/layouts/` - Layout components
- `/src/lib/` - Utility functions and hooks
- `/src/utils/` - Helper functions
- `/public/` - Static assets and PWA files

### Server
- `/server/` - Backend code
- `/server/routes.ts` - API endpoints
- `/server/storage.ts` - Data storage logic
- `/shared/` - Shared types and schemas

## Configuration & Environment
- **Node.js**: v18+ recommended
- **PORT**: Default 5173 (development)
- **SESSION_SECRET**: For session encryption
- **UPLOADS_DIR**: Directory for uploaded files

## Deployment Notes
- Built as a single application with both frontend and backend
- Static assets served from the `/client/dist` directory after build
- File uploads stored in `/uploads` directory

## Development Workflow
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Build with `npm run build`
4. Deploy the built application to a Node.js hosting environment

## Third-party Services
- No external API dependencies
- Self-contained application with all data stored locally

## Special Notes
- The website is built as a Progressive Web App (PWA) for enhanced user experience
- The application uses a custom in-memory database with file persistence
- All changes to products, categories, and settings are saved to data.json
- WhatsApp integration uses the standard WhatsApp API format (wa.me) 