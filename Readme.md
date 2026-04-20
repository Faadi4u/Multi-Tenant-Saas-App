# 🚀 Safe-Tenant SaaS: Multi-Tenant Project Management

A high-performance, production-grade **Multi-Tenant SaaS** built with the **MERN Stack (MongoDB, Express, React/Next.js, Node.js)** and **TypeScript**. This project implements the "Safe-Tenant" model, ensuring complete data isolation between different organizations using a single application instance.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14/15 (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB + Mongoose (Tenant-based Schema)
- **Validation:** Zod (Type-safe schemas)
- **State Management:** TanStack Query (Server State) & Zustand (UI State)
- **Security:** JWT (JSON Web Tokens), Bcrypt, Custom Tenant-Isolation Middleware
- **Payments:** Stripe API + Webhooks
- **Real-time:** Socket.io for tenant-specific activity feeds

## 🏗️ Project Architecture (Multi-Tenancy)

Unlike standard apps, this SaaS uses a **Shared Database, Shared Schema** approach:
1.  **Organization Isolation:** Every user belongs to a `tenantId` (Organization).
2.  **Data Security:** Every document (Tasks, Projects, Files) is strictly tied to a `tenantId`.
3.  **Middleware Guard:** The `identifyTenant` middleware extracts the `tenantId` from the user's JWT and enforces it on every database query.

## 🌟 Key Features

- **Multi-Tenant Auth:** Sign up as an Organization Owner or join via invitation.
- **RBAC (Role-Based Access Control):** Admin, Manager, and Member roles with specific permissions.
- **Dynamic Dashboard:** Real-time project tracking and task management.
- **Stripe Subscription Tiers:** 
  - *Free Tier:* 5 Projects / 3 Team members.
  - *Pro Tier:* Unlimited Projects + Analytics.
- **Invite System:** Nodemailer-powered email invitations linked to specific tenants.
- **Activity Log:** Real-time updates via Socket.io restricted to members of the same tenant.

## 🚀 Getting Started

