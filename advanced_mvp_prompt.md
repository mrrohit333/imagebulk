# 🚀 Bulk Image Downloader SaaS - Advanced MVP Prompt

## 📌 Project Overview

Build a **production-ready SaaS web application** that allows users
to: - Search images by keyword (e.g., "tomato") - Select number of
images (10, 20, 50, 100) - Download images as a ZIP file - Use a
credit-based system - Make payments using Paytm - Store data securely in
MongoDB Atlas

------------------------------------------------------------------------

## 🧠 Objective

Create a scalable, secure, and monetizable SaaS platform suitable for: -
AI dataset generation - Designers & developers - Automation workflows

------------------------------------------------------------------------

## 🏗️ Tech Stack

### Frontend

-   Next.js (React)
-   TypeScript
-   Tailwind CSS

### Backend

-   Node.js (Express)

### Database

-   MongoDB Atlas (Cloud Database)

### Authentication

-   JWT (Access Token)
-   bcrypt for password hashing

### Payments

-   Paytm Payment Gateway (Sandbox)

### Image Source

-   Unsplash API / Pexels API

### Deployment

-   Backend: Render / Railway / AWS EC2
-   Frontend: Vercel
-   Database: MongoDB Atlas

------------------------------------------------------------------------

## 🎯 Core Features

### 1. Authentication System

-   Register/Login
-   JWT-based authentication
-   Protected routes
-   Password hashing

------------------------------------------------------------------------

### 2. User Dashboard

-   Input: keyword
-   Input: image count
-   Button: Download Images
-   Display:
    -   Remaining credits
    -   Download history

------------------------------------------------------------------------

### 3. Image Downloader Service

-   Call external API (Unsplash/Pexels)
-   Fetch image URLs
-   Download images server-side
-   Compress into ZIP file
-   Return secure download link

------------------------------------------------------------------------

### 4. Credit System

-   1 image = 1 credit
-   Free plan: 20 credits
-   Deduct credits after successful download
-   Prevent download if credits insufficient

------------------------------------------------------------------------

### 5. Pricing System

  Plan    Price   Credits
  ------- ------- ---------
  Free    ₹0      20
  Basic   ₹199    500
  Pro     ₹499    2000

------------------------------------------------------------------------

### 6. Paytm Payment Integration

#### Flow:

1.  User selects plan
2.  Frontend calls backend
3.  Backend creates Paytm order
4.  Paytm checkout opens
5.  Callback verifies payment
6.  Credits added to user

#### API Endpoints:

-   POST /payments/paytm/create-order
-   POST /payments/paytm/callback

------------------------------------------------------------------------

### 7. MongoDB Atlas Integration

#### Setup:

-   Create cluster
-   Create DB user
-   Whitelist IP (0.0.0.0/0)
-   Get connection string

#### Example:

    MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

------------------------------------------------------------------------

## 🗄️ Database Models

### User

    {
      email,
      passwordHash,
      credits,
      plan,
      createdAt
    }

### Transaction

    {
      userId,
      paytmOrderId,
      amount,
      creditsAdded,
      status
    }

### DownloadLog

    {
      userId,
      keyword,
      count,
      timestamp
    }

------------------------------------------------------------------------

## 🔌 API Design

### Auth

-   POST /auth/register
-   POST /auth/login
-   GET /auth/me

### Downloads

-   POST /downloads

### Payments

-   POST /payments/paytm/create-order
-   POST /payments/paytm/callback

------------------------------------------------------------------------

## 🔐 Security Features

-   JWT authentication
-   Rate limiting
-   Input validation
-   Secure API keys (.env)
-   Password hashing

------------------------------------------------------------------------

## ⚙️ Environment Variables

    MONGO_URI=
    JWT_SECRET=
    PAYTM_MID=
    PAYTM_KEY=
    PAYTM_WEBSITE=
    PAYTM_CALLBACK_URL=
    UNSPLASH_API_KEY=

------------------------------------------------------------------------

## 🧪 Workflow

1.  User registers
2.  Gets free credits
3.  Searches images
4.  Downloads images (credits deducted)
5.  Purchases credits via Paytm
6.  Continues usage

------------------------------------------------------------------------

## 🚀 Deployment Architecture

    User → Frontend (Vercel)
         → Backend API (Render/AWS)
         → MongoDB Atlas
         → Paytm Gateway
         → Image API (Unsplash/Pexels)

------------------------------------------------------------------------

## 🔥 Advanced Features (Future)

-   Subscription plans
-   Team accounts
-   Admin dashboard
-   Image filters (size, format)
-   API access (B2B SaaS)
-   Download queue system
-   CDN storage (AWS S3)

------------------------------------------------------------------------

## 📈 Business Model

-   Freemium model
-   Credit-based purchases
-   API subscription (future)
-   Enterprise plans

------------------------------------------------------------------------

## 🧑‍💻 Output Requirement

Generate: - Full project folder structure - Backend (Express API) -
Frontend (Next.js UI) - MongoDB models - Paytm integration - Image
downloader utility - ZIP generator - Authentication system - README
documentation

------------------------------------------------------------------------

## 🎯 Goal

Build a **production-ready SaaS MVP** with: - Clean architecture -
Scalable design - Secure implementation - Monetization capability

------------------------------------------------------------------------

## ⚡ Instructions for AI

-   Write modular and clean code
-   Use best practices
-   Add comments
-   Make it production-ready
-   Ensure security and performance
