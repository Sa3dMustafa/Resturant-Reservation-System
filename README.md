# Savora

**Savora** is a bilingual restaurant reservation platform built with **Next.js 16, React 19, and TypeScript**.

It provides two experiences in one application:

- 🌐 **Public Booking** — guests can browse available tables and create reservations without an account.
- 🔐 **Staff Dashboard** — staff and admins can manage reservations, tables, working hours, and accounts based on their roles.

The application is designed with a focus on **clean architecture, reusable components, strong typing, responsive UI, and a smooth English/Arabic RTL experience**.

---

## ✨ Features

### Public Reservation

- Select reservation date and party size.
- Browse tables based on capacity and availability.
- View table status through an interactive floor view.
- Select a **continuous block of time slots**.
- Submit guest information with validation.
- Receive a reservation confirmation and unique code.
- Fully responsive booking experience.

### Staff Dashboard

- View reservation statistics.
- Search, filter, and paginate reservations.
- View reservation details.
- Confirm, cancel, or complete reservations.
- Monitor table availability.
- Responsive dashboard with loading, empty, and error states.

### Admin Management

Admins can additionally:

- Create, edit, and delete tables.
- Manage staff accounts and roles.
- Activate or deactivate accounts.
- Configure working hours.
- Support overnight working hours such as `18:00 → 02:00`.
- Configure time-slot duration.

---

## 🗓️ Reservation Flow

```text
Date & Party Size
       ↓
Available Tables
       ↓
Select Table
       ↓
Select Continuous Time Slots
       ↓
Guest Information
       ↓
Create Reservation
       ↓
Confirmation + Reservation Code
```

Reservation statuses are managed through:

```text
PENDING → CONFIRMED → COMPLETED
              │
              └──→ CANCELLED
```

---

## 🏗️ Architecture

Savora follows a **feature-based architecture** with clear separation between UI, API services, server state, validation, and authentication.

```text
src/
├── app/[locale]/
│   ├── (main)/              # Public pages
│   ├── (auth)/              # Authentication
│   └── (dashboard)/         # Staff & Admin dashboard
│
├── features/                # Domain-specific features
│   ├── auth/
│   ├── dashboard/
│   ├── reservations/
│   ├── tables/
│   ├── users/
│   ├── working-hours/
│   └── time-slots/
│
├── components/
│   ├── ui/                  # Reusable UI components
│   └── shared/              # Shared application components
│
├── hooks/                   # TanStack Query hooks
├── lib/
│   ├── api/                 # API client
│   ├── auth/                # Authentication & RBAC
│   └── services/            # API service layer
│
├── schemas/                 # Zod validation
├── types/                   # TypeScript types
├── i18n/                    # Internationalization
└── messages/                # English & Arabic translations
```

### Architecture Principles

- **Feature-based organization** keeps each domain's UI and logic together.
- **Service layer** separates API communication from UI components.
- **TanStack Query** manages server state, caching, and mutations.
- **Zod schemas** provide consistent form and API validation.
- **Centralized RBAC** controls both navigation and protected routes.
- **Reusable UI components** keep the interface consistent across the application.

---

## 🔐 Authentication & RBAC

Savora supports two roles:

| Role      | Access                   |
| --------- | ------------------------ |
| **STAFF** | Dashboard & Reservations |
| **ADMIN** | Full Management Access   |

Authentication is handled through an access token and refresh-token flow, while `GET /auth/me` acts as the source of truth for the current user.

Authorization is enforced at both the **navigation** and **route** levels.

---

## 🌍 Internationalization

The application supports:

- 🇬🇧 English
- 🇪🇬 Arabic
- ↔️ Full RTL support

Routes use an explicit locale:

```text
/en/...
/ar/...
```

All user-facing text is centralized inside:

```text
messages/
├── en.json
└── ar.json
```

The layout uses logical CSS properties so the same components work naturally in both LTR and RTL.

---

## 🛠️ Tech Stack

| Technology          | Purpose                  |
| ------------------- | ------------------------ |
| **Next.js 16**      | Framework & App Router   |
| **React 19**        | UI                       |
| **TypeScript**      | Static typing            |
| **Tailwind CSS v4** | Styling                  |
| **next-intl**       | i18n & RTL               |
| **TanStack Query**  | Server state             |
| **React Hook Form** | Form management          |
| **Zod**             | Validation               |
| **Radix UI**        | Accessible UI primitives |
| **Sonner**          | Notifications            |
| **Lucide React**    | Icons                    |
| **date-fns**        | Date utilities           |

No Redux or Zustand is used. Server state is handled by **TanStack Query**, while local UI and authentication state remain intentionally lightweight.

---

## ⚙️ Getting Started

### Installation

```bash
npm install
```

### Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start
```

The application requires the companion backend API to be running.

---

## 🎯 Project Focus

Savora demonstrates a production-oriented frontend approach combining:

**Next.js + TypeScript + Feature-based Architecture + Server State Management + Authentication + RBAC + Form Validation + Internationalization + RTL + Responsive UI**
