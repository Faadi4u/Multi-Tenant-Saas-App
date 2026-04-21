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
│   │   ├── invite.controller.ts      
│   │   ├── stripe.controller.ts      
│   │   └── webhook.controller.ts     
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rbac.middleware.ts        
│   │   ├── subscription.middleware.ts 
│   │   └── validate.middleware.ts
│   │   └── rbac.middleware.ts
│   ├── models/
│   │   ├── organization.model.ts
│   │   ├── project.model.ts
│   │   ├── task.model.ts
│   │   └── user.model.ts
│   │   └── invitation.model.ts       
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   ├── invite.routes.ts        
│   │   └── stripe.routes.ts 
│   │   └── task.routes.ts

│   ├── utils/
│   │   ├── ApiError.ts
│       ├── sendEmail.ts            
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

## 📡 API Endpoints (Full Backend)

### Auth & Invites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Create Org + Admin | Public |
| POST | `/api/v1/auth/login` | Login (HttpOnly Cookie) | Public |
| POST | `/api/v1/invites/send` | Send Team Invite | Admin |
| POST | `/api/v1/invites/accept` | Join via Invite Token | Public |

### Project & Task Management
| Method | Endpoint | Description | RBAC |
|--------|----------|-------------|------|
| POST | `/api/v1/projects` | Create Project (Gated by Plan) | Admin, Manager |
| DELETE| `/api/v1/projects/:id`| Delete Project | Admin |
| GET | `/api/v1/tasks/project/:id`| View Tasks | Member (Assigned only) |
| PATCH | `/api/v1/tasks/:id` | Update Task Status | All |

```markdown
### Billing & SaaS Logic (`/api/v1/stripe`) 💳
| Method | Endpoint            | Description                          | Auth |
|--------|---------------------|--------------------------------------|------|
| POST   | `/create-checkout`  | Start PRO subscription               | Admin|
| POST   | `/webhooks/stripe`  | Handle Stripe Events (Invoice/Pay)   | Raw  |

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

### 4. Granular RBAC (Role Based Access Control)
Access is restricted via a custom middleware that checks JWT roles against allowed permissions:
```typescript
router.route("/:projectId").delete(authorize("ADMIN"), deleteProject);
---

## ✅ Completed Backend Features
- [x] Multi-tenant authentication & Tenant Isolation
- [x] RBAC (Admin/Manager/Member permissions)
- [x] Team Invitation System (Nodemailer + TTL tokens)
- [x] Stripe Integration (Subscriptions & Webhooks)
- [x] Zod Validation & Global Error Handling

---
## 🛡️ Security Audit & Testing

This backend has been rigorously tested against common SaaS vulnerabilities:

### 1. Tenant Isolation Test (Horizontal Privilege Escalation)
- **Scenario:** User A attempts to access/modify User B's project by injecting a Project ID into the URL.
- **Result:** ✅ **PASSED**. The system returns `404 Not Found` because queries are scoped strictly to the `tenantId` in the JWT.

### 2. Payload Injection Test (Mass Assignment)
- **Scenario:** A user attempts to "plant" data into another tenant's account by sending a fake `tenantId` in the JSON body.
- **Result:** ✅ **PASSED**. The backend ignores the body's `tenantId` and forces the verified ID from the authenticated user's session.

### 3. Role Escalation Test (Vertical Privilege Escalation)
- **Scenario:** A "Member" attempts to promote themselves to "Admin" by sending `"role": "ADMIN"` in a profile update request.
- **Result:** ✅ **PASSED**. Field-level whitelisting ensures only permitted fields (e.g., `name`) are updated, while roles remain locked.

### 4. Schema Validation Test
- **Scenario:** Sending malformed or empty data to API endpoints.
- **Result:** ✅ **PASSED**. Zod middleware intercepts the request and returns a standardized `400 Bad Request` with a list of specific validation errors.

---
## 🔜 Upcoming (Frontend Phase)
- [ ] Next.js 15 Dashboard UI
- [ ] TanStack Query Integration
- [ ] Real-time Activity Feed (Socket.io)
- [ ] User Profile & Settings

---
