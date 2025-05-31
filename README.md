# 🕒 Clients Projects Dashboard

A web application built with **Next.js**, **Supabase**, and **shadcn/ui** to centralize client, project, task, and time tracking management. It automates time tracking and invoice generation through a unified dashboard.

---

## 🚀 Technologies

- [Next.js 14](https://nextjs.org/)
- [Supabase](https://supabase.com/) (Auth + Database)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/)
- Vite (experimental setup using `next-vite`)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/clients-projects-dashboard.git
cd clients-projects-dashboard
npm install
cp .env.example .env.local
# Add your Supabase keys to .env.local
npm run dev
```

---

## ✅ Current Features

- User registration (Supabase auth)
- Login page (UI only)
- Password recovery page (UI only)
- Basic landing page with hero and buttons
- Supabase integration (`@supabase/supabase-js`)
- Responsive UI with shadcn/ui and Tailwind

---

## 🗺️ Roadmap

### MVP (in progress)

- [x] User registration
- [ ] Functional login with Supabase
- [ ] Functional password recovery
- [ ] Protected routes for authenticated users
- [ ] Initial dashboard for authenticated users

### Later Iterations

#### Iteration 2: Data Management

- [ ] Create clients
- [ ] Create projects linked to clients
- [ ] Create tasks linked to projects

#### Iteration 3: Time Tracking

- [ ] Implement task timer
- [ ] Track and store work sessions

#### Iteration 4: Statistics + Invoicing

- [ ] Metrics dashboard (by client, project, month)
- [ ] Generate invoices automatically
- [ ] Export/send as PDF

#### Iteration 5: UX/UI Polishing

- [ ] Colored tags for projects
- [ ] Light/Dark mode support
- [ ] Smooth transitions and animations

---

## 📁 Project Structure

```bash
src/
  app/
    login/
    register/
    recover/
    page.tsx (landing page)
  lib/
    supabaseClient.ts
  components/
    ui/ (shadcn components)
```

---

## 👤 Author

**Ángel** – Frontend Developer  
💬 Stack: React · Next.js · Supabase · Tailwind · Vite

---

## 📝 License

MIT
