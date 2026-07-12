# 🚛 TransitOps — Smart Transport Operations Platform

TransitOps is a centralized web platform that digitizes the complete lifecycle of transport operations — vehicle registry, driver management, trip dispatching, maintenance, fuel/expense tracking, and analytics — replacing spreadsheets and manual logbooks with real-time operational visibility.

Built in an 8-hour hackathon sprint, TransitOps enforces core business rules (license validity, load capacity, vehicle/driver availability) automatically, so fleet managers, drivers, safety officers, and financial analysts always work off a single source of truth.

---

## ✨ Features

- 🔐 **Authentication & RBAC** — Email/password login with role-based access for Fleet Manager, Driver, Safety Officer, and Financial Analyst
- 📊 **Dashboard** — Live KPIs (Active/Available Vehicles, Vehicles in Maintenance, Active/Pending Trips, Drivers on Duty, Fleet Utilization %) with filters by vehicle type, status, and region
- 🚗 **Vehicle Registry** — Master list with unique registration numbers, load capacity, odometer, acquisition cost, and status tracking
- 🧑‍✈️ **Driver Management** — Profiles with license category/expiry, safety score, and status
- 🗺️ **Trip Management** — Draft → Dispatched → Completed → Cancelled lifecycle with full validation
- 🔧 **Maintenance Workflow** — Auto-updates vehicle status to "In Shop", removing it from dispatch pools
- ⛽ **Fuel & Expense Tracking** — Logs fuel, tolls, and maintenance costs, auto-computing total operational cost per vehicle
- 📈 **Reports & Analytics** — Fuel Efficiency, Fleet Utilization, Operational Cost, and Vehicle ROI, with CSV export

---

## 🧠 Business Rules Enforced

- Vehicle registration numbers must be unique
- Retired or In Shop vehicles are excluded from dispatch selection
- Drivers with expired licenses or Suspended status cannot be assigned to trips
- A vehicle or driver already On Trip cannot be double-booked
- Cargo weight cannot exceed a vehicle's maximum load capacity
- Dispatching a trip sets both vehicle and driver to **On Trip**
- Completing or cancelling a trip restores both to **Available**
- Creating a maintenance record sets the vehicle to **In Shop**; closing it restores **Available** (unless retired)

---

## 🏗️ Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | [Next.js](https://nextjs.org/) (App Router) |
| Backend        | Next.js API Routes / Server Actions |
| Database       | [PostgreSQL](https://www.postgresql.org/) |
| ORM            | [Drizzle ORM](https://orm.drizzle.team/) |
| Auth           | Email/password with RBAC middleware |
| Styling        | Tailwind CSS |

---

## 🗂️ Database Entities

`Users` · `Roles` · `Vehicles` · `Drivers` · `Trips` · `Maintenance Logs` · `Fuel Logs` · `Expenses`

Schema is defined and managed via Drizzle ORM under `src/db/schema.ts`, with migrations generated using `drizzle-kit`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance (local or hosted, e.g. Neon/Supabase)
- pnpm / npm / yarn

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/transitops.git
cd transitops
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
AUTH_SECRET="your-secret-key"
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Useful Scripts

| Command                  | Description                          |
|---------------------------|---------------------------------------|
| `npm run dev`              | Start the development server         |
| `npm run build`             | Build for production                 |
| `npm run start`             | Start the production server          |
| `npx drizzle-kit generate`  | Generate SQL migrations              |
| `npx drizzle-kit push`      | Push schema changes to the database  |
| `npx drizzle-kit studio`    | Open Drizzle Studio to inspect data  |

---

## 👥 User Roles

| Role              | Responsibilities                                              |
|-------------------|-----------------------------------------------------------------|
| Fleet Manager     | Oversees vehicles, maintenance, and operational efficiency     |
| Driver            | Creates trips, assigns vehicles/drivers, monitors deliveries   |
| Safety Officer    | Tracks license validity and driver safety scores               |
| Financial Analyst | Reviews expenses, fuel costs, maintenance costs, and profitability |

---

## 🎯 Roadmap / Bonus Features

- [ ] PDF export for reports
- [ ] Email reminders for expiring licenses
- [ ] Vehicle document management
- [ ] Advanced search, filters, and sorting
- [ ] Dark mode
- [ ] Charts and visual analytics dashboard

---

## 🖼️ Design Reference

UI mockups: [Excalidraw Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/1FHGDNgD2td)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue.

## 📄 License

This project is licensed under the MIT License.