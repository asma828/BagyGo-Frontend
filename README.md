# 📦 BagyGo - Modern Parcel Transport Platform

BagyGo is a premium, community-driven platform that connects travelers (**Transporters**) with people needing to send packages (**Senders**). This repository contains the **Angular Frontend**, built with a focus on high performance, responsive design, and a seamless user experience.

---

## 🚀 Key Features

- **Multi-Role Dashboards**: Custom interfaces for Senders, Transporters, and Administrators.
- **Trip Management**: Transporters can post travel schedules, available weight, and pricing.
- **Smart Search**: Senders can find trips based on departure/arrival cities and dates.
- **Baggage Requests**: Integrated workflow for senders to request transport and negotiate prices.
- **Admin Monitoring**: Real-time overview of users, trips, requests, and payments.
- **Real-time Notifications**: Instant updates for offer status changes and system alerts.
- **Premium UI**: Modern aesthetics using Tailwind CSS, glassmorphism, and smooth animations.

---

## 🛠 Tech Stack

- **Framework**: [Angular](https://angular.dev/) (latest version with Signals)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Angular Signals & RxJS
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Build Tool**: Vite (underlying Angular CLI)

---

## 📂 Project Structure

```text
src/app/
├── core/                # Singleton services, models, guards, and interceptors
│   ├── interceptors/    # JWT & Error handling
│   ├── services/       # API communication (Auth, Trip, Request, etc.)
│   └── models/         # TypeScript interfaces & types
├── shared/             # Reusable components (buttons, badges, modals)
├── features/           # Module-based feature areas
│   ├── auth/           # Login, Registration, Password Reset
│   ├── dashboard/      # Role-based layouts and homes
│   │   ├── admin/      # User management & Monitoring
│   │   ├── sender/     # Find transport, My requests, Settings
│   │   └── transporter/# Post trips, Browse requests, My trips
│   └── landing/        # Public landing page
└── app.routes.ts       # Centralized routing configuration
```

---

## 📥 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Angular CLI](https://angular.dev/tools/cli) installed globally

### 1. Clone the repository
```bash
git clone https://github.com/asma828/BagyGo-Frontend.git
cd BagyGo-Frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
The application expects the backend to be running on `http://localhost:8080`. You can adjust configurations in `src/environments/`.

### 4. Run Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

## 🧪 Testing

To run unit tests with Vitest:
```bash
ng test
```

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🤝 Contact
For any inquiries or support, please contact the repository owner.
