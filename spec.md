# Specification

## Summary
**Goal:** Build a full-stack automotive news and marketing website ("Upcoming Cars") featuring car listings, news articles, comparison tools, search/filter, an admin panel, and a dark/light themed UI with an automotive-inspired design system.

**Planned changes:**

**Backend (single Motoko actor):**
- Data models: Car, NewsArticle, UserRating, NewsletterSubscriber with stable storage
- CRUD functions for Car and NewsArticle entities
- Query functions: getCarsByFilter, searchCars, getCarComparison
- Mutation functions: submitRating, subscribeNewsletter
- Admin functions: adminAddCar, adminUpdateCar, adminDeleteCar, adminAddNews, adminUpdateNews, adminDeleteNews

**Frontend pages & components:**
- **Homepage** (`/`): Hero carousel (featured cars), latest news slider, trending cars grid, EV vs Petrol comparison callout, featured brands strip, newsletter subscription form, latest articles grid, ad banner placeholders
- **Car Listing & Search** (`/cars`): Text search bar (debounced), sidebar filters (Type, Price Range, Brand, Launch Year), responsive car card grid
- **Car Details** (`/cars/:id`): Image gallery with thumbnails, full specs display (EV range or petrol mileage), features lists, pros/cons, expert review, star rating widget, social share buttons (WhatsApp, X, Facebook)
- **News Listing** (`/news`): Articles grid with category filter tabs, thumbnail/title/excerpt/date, ad banner placeholders
- **News Detail** (`/news/:id`): Full article content and image
- **Car Comparison** (`/compare`): Dual searchable car selectors, side-by-side comparison table with highlighted winning cells
- **Admin Panel** (`/admin`): Two tabs (Cars, News) with add/edit/delete forms for all fields, form validation
- **Global UI**: Sticky responsive navbar (hamburger on mobile), dark/light mode toggle (default dark, persisted in localStorage), footer with tagline/links/social icons, consistent automotive color palette (Black #0A0A0A, Red #E41E2B, White #FFFFFF, Metallic Grey #2A2A2A), bold sans-serif typography, smooth hover/transition animations, subtle hero entry motion

**User-visible outcome:** Users can browse upcoming EV and petrol cars with full specs, compare two cars side-by-side, read automotive news filtered by category, search and filter cars, subscribe to a newsletter, and rate cars. Admins can manage all car and news content via an unprotected admin panel. The site works across mobile, tablet, and desktop in both dark and light modes.
