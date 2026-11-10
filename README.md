# Solar Depot — Mobile Application UI

A complete, professional, premium-quality **Solar Depot Mobile Application UI** developed with React and JavaScript. 

Engineered with a genuine mobile-first screen hierarchy, smooth interactions, rich local data, side-by-side comparison matrix, in-app PDF document previewer, and client-side quote request workflows.

---

## 📱 Mobile-First Design & Desktop Shell

- **Desktop Preview**: Displayed inside a centered smartphone frame (~390px × 844px) with realistic phone chrome, dynamic island speaker pill, real-time clock, status bar indicators (cellular, Wi-Fi, battery), and a dark luxury backdrop (`#03070B`) with cyan ambient lighting.
- **Mobile View**: Automatically adapts to occupy the full 100% viewport width and height on mobile devices, with native touch padding, safe-area inset support, and fixed bottom navigation.

---

## 🚀 Key Modules & Capabilities

1. **Home Dashboard**
   - Dynamic time-aware greeting (*"Good morning/afternoon/evening, Alex"*).
   - Promotional brand banner highlighting 15+ years of renewable engineering excellence.
   - Quick action shortcuts (*Browse Products*, *Compare Inverters*, *Download Datasheets*, *Request a Quote*, *Contact Support*).
   - Horizontal category strip and featured inverter cards.
   - Tailored solar solutions and verified case studies.

2. **Products & Inverters Catalog**
   - **7 Core Categories**: Single-Phase String Inverters, Three-Phase String Inverters, Three-Phase String Inverters (LV), Hybrid Inverters, Microinverters, Solar Air Conditioners, and Accessories & Monitoring.
   - Real-time local search across models, names, and descriptions.
   - Functional filters: Category chips, Phase type (Single/Three-Phase), Capacity ranges (Under 5kW, 5–15kW, 15kW+).
   - Sorting options: Name (A–Z / Z–A), Capacity (Low–High / High–Low), Highest Efficiency.
   - Toggleable Grid vs. List layouts.
   - **Product Detail Screen**: Multi-angle image gallery with thumbnail picker, capacity & efficiency badges, grouped accordion tables for Electrical & Mechanical parameters, related inverters, and quick actions (*Save*, *Compare*, *View PDF*, *Request Quote*).

3. **Side-by-Side Inverter Comparison**
   - Compare up to 4 inverters simultaneously in a horizontally scrollable comparison matrix.
   - Compares Rated Power, Max Efficiency, Phase, Voltage range, Dimensions, Weight, and Enclosure rating.
   - Difference-highlighting toggle to easily spot variations.
   - Product picker modal to add more models into the comparison.
   - Persistent floating comparison badge tracking selected items across all screens.

4. **Solar Solutions**
   - Solutions for *Energy Storage Plants*, *PV Grid-Tie Plants*, *Micro-Inverter Plants*, *Residential Applications*, and *Commercial Applications*.
   - Detail screens featuring a 4-step system architecture flow, economic benefits, compatible inverters, and real case studies.

5. **Case Studies & Projects**
   - Portfolio of residential, commercial, utility, and hybrid solar installations.
   - Technical specifications for each project: System Size, Inverter banks, Annual Yield, and CO₂ Offset.
   - Direct links to deployed inverter models.

6. **Technical Downloads & In-App PDF Viewer**
   - Categorized library: Product Datasheets, Installation Manuals, Certificates & Compliance (UL 1741 / IEEE 1547), and System Guides.
   - Searchable document index with file sizes and revision dates.
   - **In-App PDF Viewer Modal**: Multi-page document preview sheets, zoom controls, simulated downloads with progress feedback, and Web Share API integration.

7. **Saved / Favorite Products**
   - One-tap bookmarking persisted in `localStorage`.
   - Direct comparison and detail shortcuts from the saved items list.

8. **Request a Quote / Enquiry Consultation**
   - Comprehensive enquiry form with client-side validation for required fields, email format, and phone number.
   - Project type selector, capacity, quantity, and single-line diagram attachment simulation.
   - Clear demo confirmation screen providing a generated reference ID (e.g. `SDQ-2026-XXXX`).
   - Automatically records the enquiry into the demo enquiry history.

9. **Customer Profile & Settings**
   - Verified EPC partner profile (*Alex Morgan*, *Apex Energy Partners LLC*).
   - **My Enquiries**: Interactive demo enquiry history with status badges (*Quote Prepared*, *Engineering Review*, *Completed*).
   - **Edit Profile**: Frontend profile editor.
   - **App Settings**: Power measurement units toggle (kW vs. W), notification preferences, and local cache management.

10. **Support & Contact**
    - Verified Solar Depot phone links (`+1 212 300 4115`, `+1 212 722 9555`, mobile `+1 516 669 9055`), email (`Contact@solardepot-us.com`), and NYC headquarters Google Maps link.
    - Interactive FAQs accordion.
    - Support ticket submission form.

11. **Global Search & Notifications**
    - Instant live search modal across inverters, solutions, projects, and documents with suggestion chips.
    - Notification center with unread count badges, timestamps, and filter toggles.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) (Functional Components, Hooks)
- **Language**: JavaScript (ES Modules, JSX — no TypeScript / TSX)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **State Management**: Centralized React Context (`AppContext`) with `localStorage` persistence

---

## 📂 Project Directory Structure

```text
├── public/
│   └── favicon.svg                  # Brand favicon
├── src/
│   ├── app/
│   │   ├── App.jsx                  # App container & router provider
│   │   └── routes.jsx               # Screen routes definition
│   ├── components/
│   │   ├── common/                  # Reusable UI buttons, badges, search bars, headers, toasts
│   │   ├── forms/                   # Validated enquiry & support forms
│   │   ├── layout/                  # Mobile frame container, app header, bottom nav, modals
│   │   ├── products/                # Product cards, gallery, specs tables, filters, sorters
│   │   ├── projects/                # Case study cards
│   │   ├── resources/               # Resource & datasheet cards
│   │   └── solutions/               # Solar solution architecture cards
│   ├── context/
│   │   └── AppContext.jsx           # Global state (favorites, compare, enquiries, notifications)
│   ├── data/
│   │   ├── companyData.js           # Verified Solar Depot company info & contact links
│   │   ├── demoData.js              # Sample profile, enquiries history, notifications, FAQs
│   │   ├── images.js                # Verified Pexels solar assets from reference
│   │   ├── productsData.js          # All 12 inverters across 7 categories with full specs
│   │   ├── projectsData.js          # 8 real installation case studies
│   │   ├── resourcesData.js         # Technical datasheets, manuals & certificates
│   │   └── solutionsData.js         # 5 solar architectures
│   ├── hooks/
│   │   └── useLocalStorage.js       # Safe localStorage persistence hook
│   ├── pages/                       # Screen views (Home, Products, Compare, Solutions, etc.)
│   ├── styles/
│   │   └── global.css               # Design system tokens, glassmorphism, scrollbars
│   ├── utils/
│   │   ├── formatters.js            # Capacity, date, and greeting formatters
│   │   └── validators.js            # Form validation logic
│   └── main.jsx                     # Vite React entry point
├── index.html                       # HTML5 entry template with Plus Jakarta Sans & Space Grotesk
├── package.json                     # Project scripts and dependencies
├── postcss.config.js                # PostCSS config for Tailwind
├── tailwind.config.js               # Theme colors (midnight, electric, cantaloupe, etc.)
├── vercel.json                      # Vercel SPA routing rewrite rules
└── vite.config.js                   # Vite configuration
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
This produces an optimized production bundle inside the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🐙 Push to GitHub

Follow these steps to push this repository to GitHub:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files to staging
git add .

# 3. Create your initial commit
git commit -m "feat: complete Solar Depot mobile application UI"

# 4. Rename current branch to main
git branch -M main

# 5. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚡ Deploy to Vercel

The project includes a ready-to-use [`vercel.json`](./vercel.json) configuration that handles client-side routing for Single Page Applications (SPAs) so all direct routes (e.g. `/products`, `/solutions`, `/compare`, etc.) resolve seamlessly without 404 errors.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub** following the instructions above.
2. Go to [vercel.com](https://vercel.com/) and sign in.
3. Click **"Add New..."** → **"Project"**.
4. Select and import your GitHub repository.
5. Vercel will automatically detect the settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**. Your mobile application will be live in seconds!

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (if not installed)
npm install -g vercel

# Run vercel deployment command
vercel

# For production deployment
vercel --prod
```

---

## 📄 License

Private & Proprietary — Developed for Solar Depot UI.

