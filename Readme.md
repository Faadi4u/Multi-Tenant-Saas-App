# 🚀 Safe-Tenant SaaS: Multi-Tenant Project Management

A high-performance, production-grade **Multi-Tenant SaaS** built with the **MERN Stack (MongoDB, Express, React/Next.js, Node.js)** and **TypeScript**. This project implements the "Safe-Tenant" model, ensuring complete data isolation between different organizations using a single application instance.

---

## 🛠️ Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| **Frontend**   | Next.js 14/15 (App Router), Tailwind CSS, shadcn/ui |
| **Backend**    | Node.js, Express, TypeScript                    |
| **Database**   | MongoDB + Mongoose (Tenant-based Schema)        |
| **Validation** | Zod (Type-safe schemas)                         |
| **State**      | TanStack Query (Server) & Zustand (UI)          |
| **Security**   | JWT, Bcrypt, Custom Tenant-Isolation Middleware |
| **Payments**   | Stripe API + Webhooks                           |
| **Real-time**  | Socket.io (Tenant-specific activity feeds)      |

---

## 🏗️ Project Architecture (Multi-Tenancy)

Unlike standard apps, this SaaS uses a **Shared Database, Shared Schema** approach:

```
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                     │
├─────────────────────────────────────────────────────────┤
│  Organization A (tenantId: 123)                         │
│    ├── Users (Admin, Manager, Member)                   │
│    ├── Projects                                         │
│    └── Tasks                                            │
├─────────────────────────────────────────────────────────┤
│  Organization B (tenantId: 456)                         │
│    ├── Users (Admin, Manager, Member)                   │
│    ├── Projects                                         │
│    └── Tasks                                            │
└─────────────────────────────────────────────────────────┘
```

### How Tenant Isolation Works:
1. **Organization Isolation:** Every user belongs to a `tenantId` (Organization).
2. **Data Security:** Every document (Tasks, Projects) is strictly tied to a `tenantId`.
3. **Middleware Guard:** The `verifyJWT` middleware extracts the `tenantId` from the user's JWT and enforces it on every database query.

---

## 🌟 Key Features

- ✅ **Multi-Tenant Auth:** Sign up as an Organization Owner or join via invitation.
- ✅ **RBAC (Role-Based Access Control):** Admin, Manager, and Member roles with specific permissions.
- ✅ **Dynamic Dashboard:** Real-time project tracking and task management.
- ✅ **Stripe Subscription Tiers:**
  - *Free Tier:* 5 Projects / 3 Team members.
  - *Pro Tier:* Unlimited Projects + Analytics.
- ✅ **Invite System:** Nodemailer-powered email invitations linked to specific tenants.
- ✅ **Activity Log:** Real-time updates via Socket.io restricted to members of the same tenant.

---

## 📂 Backend Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/
│   │   ├── organization.model.ts
│   │   ├── project.model.ts
│   │   ├── task.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   └── task.routes.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── asyncHandler.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── task.validator.ts
│   ├── db/
│   │   └── index.ts
│   ├── app.ts
│   ├── server.ts
│   └── constant.ts
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/safe-tenant-saas.git
cd safe-tenant-saas
```

### 2. Install Dependencies
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the **backend** folder:
```env
PORT=5000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. Run Development Servers
```bash
# From root (runs both)
npm run dev

# Or individually
cd backend && npm run dev
cd frontend && npm run dev
```

---

## 📡 API Endpoints

### Auth Routes (`/api/v1/auth`)
| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| POST   | `/register` | Create Organization + Admin User     |
| POST   | `/login`    | Login and receive JWT token          |

### Project Routes (`/api/v1/projects`) 🔒
| Method | Endpoint | Description                              |
|--------|----------|------------------------------------------|
| GET    | `/`      | Get all projects for the logged-in tenant |
| POST   | `/`      | Create a new project                     |

### Task Routes (`/api/v1/tasks`) 🔒
| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/`                   | Create a new task                        |
| GET    | `/project/:projectId` | Get all tasks for a specific project     |

> 🔒 = Requires Authentication (JWT Token)

---

## 🛡️ Security Implementation

### 1. Tenant Isolation
Every query includes `tenantId` from the JWT:
```typescript
const tasks = await Task.find({ tenantId: req.user?.tenantId });
```

### 2. Password Security
- Passwords are hashed using `bcrypt` (salt rounds: 10)
- `select: false` prevents passwords from being returned in queries
- `toJSON` transform removes password even if accidentally selected

### 3. Input Validation
All incoming requests are validated using Zod schemas before reaching controllers.

---

## 🔜 Upcoming Features

- [ ] RBAC Middleware (Admin/Manager/Member permissions)
- [ ] Team Invitation System (Nodemailer)
- [ ] Stripe Integration (Subscriptions & Webhooks)
- [ ] Real-time Activity Feed (Socket.io)
- [ ] Frontend Dashboard (Next.js 14)

---
