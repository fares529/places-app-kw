# 🇰🇼 Kuwait Places Guide — دليل أماكن الكويت

A modern, mobile-first guide to discover the best places in Kuwait — restaurants, cafes, malls, tourist landmarks, and services. Built as a Next.js MVP with bilingual support (Arabic/English) and a beautiful phone-shell UI.

## ✨ Features

### 🏠 Public App
- **Bilingual UI** — Arabic (RTL) + English (LTR) with one-tap toggle
- **Mobile-first design** — Phone-shell layout that looks like a native app on desktop
- **Search & filter** — Find places by category, area, or keyword
- **Place details** — Photos gallery + map (OpenStreetMap via Leaflet) + directions
- **5 categories** — Tourist places, restaurants, cafes, services, malls
- **25 mock places** — Real Kuwaiti locations across Kuwait City, Salmiya, Hawalli, etc.

### 🔐 Authentication
- **Phone-based login** with Gulf country code selector (🇰🇼 🇸🇦 🇦🇪 🇶🇦 🇧🇭 🇴🇲)
- **WhatsApp OTP** verification flow (Demo mode — shows code in-app)
- **Country tracking** for analytics

### 🛠 Admin Panel
- **Dashboard** with stats: app opens, total visits, places, ratings, featured count
- **Visits by Country** — Gulf-region analytics with progress bars
- **Most Visited Places** — Top 5 with medal badges
- **Categories Distribution** — Visual breakdown
- **Places CRUD** — Add/edit/delete with full image management
- **Image Manager** — Thumbnails, reorder, auto-generate themed placeholders
- **Editable Categories** — Change name, icon, and color
- **Floating Edit FAB** on place details — quick-edit any place
- **Quick Swap Main Image** action

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + `tailwindcss-rtl`
- **Icons:** [lucide-react](https://lucide.dev)
- **Maps:** [react-leaflet](https://react-leaflet.js.org) + OpenStreetMap
- **Storage:** localStorage (MVP — no backend yet)
- **Fonts:** Tajawal (Arabic) + Inter (English) via `next/font`

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (or `PORT=3030 npm run dev` for a clean port).

## 📁 Project Structure

```
.
├── app/
│   ├── page.tsx                    # Home (hero + categories + featured)
│   ├── places/
│   │   ├── page.tsx                # Places list with filters
│   │   └── [id]/page.tsx           # Place details + map + edit FAB
│   ├── login/page.tsx              # Phone + country selector
│   ├── verify/page.tsx             # OTP verification (6-digit input)
│   └── admin/
│       ├── page.tsx                # Dashboard with all analytics
│       ├── places/page.tsx         # CRUD places with quick actions
│       └── categories/page.tsx     # Editable categories
├── components/
│   ├── ui/                         # Button, Card, Rating, Badge, Icon, Input
│   ├── layout/                     # Header, BottomNav, Footer
│   ├── home/                       # HeroSearch, CategoryGrid, FeaturedPlaces
│   ├── places/                     # PlaceCard, PlacesFilter, PlaceMap, PlaceGallery
│   └── admin/                      # AdminLayout, PlaceForm, ImageManager
├── lib/
│   ├── data/                       # mockPlaces (25), mockCategories, countries (6 Gulf)
│   ├── i18n/                       # ar.json + en.json + Context provider
│   ├── store/                      # placesStore, authStore, visitsStore, categoriesStore
│   └── types.ts                    # Place, Category, User types
└── public/
```

## 🌍 Gulf Countries Supported

| Country | Code | Phone Length |
|---|---|---|
| 🇰🇼 Kuwait | +965 | 8 digits |
| 🇸🇦 Saudi Arabia | +966 | 9 digits |
| 🇦🇪 UAE | +971 | 9 digits |
| 🇶🇦 Qatar | +974 | 8 digits |
| 🇧🇭 Bahrain | +973 | 8 digits |
| 🇴🇲 Oman | +968 | 8 digits |

## 🎨 Design Notes

- **Phone shell** — On desktop, the app renders inside a centered phone frame (max-width 430px) with rounded edges and a dark bezel for an authentic mobile feel.
- **Color palette** — Primary turquoise (Kuwaiti sea), accent gold (stars), neutral grays.
- **Image strategy** — Each place has 2 themed placeholder images using `placehold.co` with category color + place name. Easy to swap with real photos later.

## 🔮 Roadmap (Post-MVP)

- [ ] **Supabase integration** — Replace localStorage with PostgreSQL DB
- [ ] **Real WhatsApp OTP** — Twilio + WhatsApp Business API
- [ ] **User reviews & ratings** — Let logged-in users rate places
- [ ] **Photo uploads** — Image storage in Supabase Storage
- [ ] **Real-time analytics** — Track visits server-side
- [ ] **Push notifications** — Notify about new featured places
- [ ] **PWA** — Installable as a real app
- [ ] **Admin authentication** — Currently open access

## 📝 License

MIT

---

Made with ❤️ for the Kuwait community
