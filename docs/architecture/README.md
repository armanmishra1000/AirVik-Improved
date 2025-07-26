# Architecture Documentation

This directory contains technical architecture documentation for the Airvik hotel booking system.

## Overview
- **Monorepo Structure**: Backend and frontend in separate directories
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **API**: RESTful with JWT authentication
- **Database**: MongoDB with Mongoose ODM

## Key Patterns
- Service layer pattern (Controller → Service → Model)
- Consistent API response format
- Error handling middleware
- JWT with refresh tokens
- TypeScript throughout
