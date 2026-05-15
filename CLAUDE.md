# Nitro Plus Trading — Project Context

> This file is the source of truth for how Claude works on this project.
> Read it before planning ANY task. Update it when conventions change.

---

## 1. Project Overview

Corporate website for **Nitro Plus Trading**, operating under a UAE general trade license.

**What we are:** An auto parts trading business with deep, hands-on experience in the vehicle parts industry. We supply parts, components, and aftermarket products across the full breadth of the automotive market.

### Vehicle verticals we serve

- **4×4 / Off-road** — Land Cruiser, Wrangler, Patrol, Defender, Raptor, Bronco, G-Class off-road builds.
- **American muscle & performance** — Mustang, Camaro, Challenger, Charger, Corvette, Hellcat, Trans Am, and the wider American performance scene.
- **Luxury & premium** — Mercedes-Benz, BMW, Audi, Lexus, Range Rover, Bentley, Rolls-Royce. The high-end daily-driver and chauffeur market.
- **Exotics & supercars** — Ferrari, Lamborghini, McLaren, Porsche, Aston Martin, Maserati. Low-volume, high-margin, requires real expertise.
- **European sport** — BMW M, Mercedes-AMG, Audi RS, Porsche 911 platform. Performance Europeans that overlap luxury and tuning.
- **JDM & Asian performance** — Skyline / GT-R, Supra, RX-7, Evo, WRX/STI, Civic Type R, NSX. Strong enthusiast demand for hard-to-find parts.
- **Heavy machinery & commercial vehicles** — trucks, construction equipment, fleet vehicles, industrial and agricultural machinery.
- **Classic & vintage** — restoration work, hard-to-source OEM and NOS parts, period-correct rebuilds.
- **Electric & hybrid** — Tesla, Lucid, Polestar, and the growing EV aftermarket (wheels, suspension, interior, software-adjacent accessories).
- **Standard passenger vehicles** — daily drivers across all major brands. Volume business that funds the specialist work.

### Product categories we deal in

Grouped by vehicle system. Within each, we cover OEM, OEM-equivalent, and performance / aftermarket tiers.

- **Wheels & tires** — alloy and forged wheels, beadlock for off-road, passenger / off-road / track / commercial tire grades.
- **Suspension & steering** — coilovers, lift kits, lowering springs, control arms, sway bars, bushings, steering racks, tie rods.
- **Engines & forced induction** — long blocks, short blocks, crate motors, engine swaps, turbochargers, superchargers, intercoolers, manifolds.
- **Drivetrain & transmission** — gearboxes, clutches, flywheels, differentials, axles, driveshafts, transfer cases.
- **Exhaust systems** — headers, downpipes, mid-pipes, cat-backs, mufflers, resonators.
- **Brakes** — calipers, rotors, pads, big brake kits (BBKs), brake lines, master cylinders.
- **Cooling & fluids** — radiators, oil coolers, fans, water pumps, plus engine oil, coolant, transmission fluid, brake fluid, filters.
- **Fuel & induction** — fuel pumps, injectors, fuel rails, air intakes, throttle bodies.
- **Electrical & electronics** — batteries, alternators, starters, sensors, ECUs, wiring, ignition.
- **ECU tuning & engine management** — flash tunes, standalone ECUs, boost controllers, gauges, AFR meters.
- **Lighting** — OEM headlights, LED / HID upgrades, off-road light bars, ditch lights, taillights.
- **Body & exterior** — bumpers, hoods, fenders, body kits, spoilers, splitters, mirrors, trim, glass.
- **Off-road accessories** — bull bars, skid plates, rock sliders, winches, snorkels, roof racks, recovery gear.
- **Interior** — OEM and racing seats, steering wheels, harnesses, gauges, instrument clusters, floor mats, upholstery.
- **General replacement parts** — OEM and OEM-equivalent for everyday servicing across all the above.
- **Sourcing & special orders** — hard-to-find, discontinued, NOS, and import-on-request items. This is where our experience pays off most.

**Why we exist:** Years of real industry experience, not a dropshipping front. Customers come to Nitro Plus because we actually know the difference between a part that fits and a part that works.

**Primary audiences:**

- **B2B** — workshops, garages, dealerships, body shops, fleet operators, construction and industrial companies, and EV / luxury service centers.
- **B2C** — car owners and enthusiasts across every vertical: muscle, 4×4, JDM, exotic, classic, EV, and daily-driver owners looking for trustworthy parts and honest advice.

**Tone:** Professional and trustworthy, with genuine automotive character. Performance-aware, knowledgeable, confident. **Not** generic corporate-bland, and **not** boy-racer / neon-and-flames. Think "a workshop owner you trust" — not "a Fast & Furious poster."

### Commerce model — quote catalog, NOT transactional e-commerce

**Read this carefully. It defines what we are and aren't building.**

The site has a **shop / parts catalog**, but it is a **Request-for-Quote (RFQ) flow**, not a transactional store. We do not hold warehouse stock, we do not process payments, and we do not ship orders directly through the site. The flow is:

1. Customer browses the catalog and adds parts to an inquiry basket ("Add to Quote" — *not* "Add to Cart" or "Buy Now").
2. The basket icon in the header shows the inquiry count.
3. On the `/quote` page, the customer reviews items, enters contact info, vehicle details (make / model / year / VIN if available), and notes.
4. Submit triggers a single API route that:
   - Sends a formatted email to Nitro Plus via **Resend** with the full itemized inquiry + customer info.
   - Returns a pre-filled WhatsApp deep link (`https://wa.me/<number>?text=...`) the customer can tap to message us directly with the same details.
5. We respond to the customer over email or WhatsApp with pricing, availability, and lead time.
6. The actual transaction happens off-site, person to person.

**What this means for the build:**

- ✅ Product catalog, categories, search, filters, "Add to Quote" buttons, inquiry basket, RFQ form.
- ❌ No Stripe, no payment UI, no checkout flow, no shipping calculator, no tax engine.
- ❌ No inventory counts, "in stock / out of stock" badges, or stock-level displays. Everything is "available to source."
- ❌ No fixed prices shown unless we explicitly confirm a price for that SKU. Default copy is "Request quote" or "Pricing on inquiry," never a fabricated number.
- ❌ No user accounts, login, order history, or wishlist (initially). The inquiry basket lives in `localStorage` — that's enough.

**Cart state:** client-side via `localStorage`, managed with Zustand (or `useReducer` + Context if Zustand feels heavy). Survives page refresh, cleared after successful submission.

---

## 2. Goals (in priority order)

1. **Trust & credibility** — visitors must immediately feel this is a serious operator with real industry knowledge, not a reseller.
2. **Clarity of offering** — within 5 seconds, a visitor should know which vehicle types we serve and which part categories we cover.
3. **Inquiry conversion** — the single most important user action is "contact us about a specific part / vehicle." Every page should make that easy.
4. **Speed** — LCP < 2.0s on mid-tier mobile over 4G. Lighthouse Performance ≥ 90.
5. **Accessibility** — WCAG 2.2 AA minimum. Zero axe-core violations.
6. **SEO** — server-rendered HTML, proper meta, JSON-LD structured data (Organization + LocalBusiness + Product where applicable), sitemap, robots.
7. **Bilingual** — full Arabic (RTL) + English (LTR) parity. Proper RTL layout, not just translated strings.

---

## 3. Tech Stack

> **Portability rule — read this first.** This site must run on **Vercel, Netlify, Cloudflare Pages, or a self-hosted server without code changes.** Vercel is the default deploy target below, but it is not a dependency. If a task would couple the codebase to a single platform, stop and flag it instead of building it.

- **Framework:** Next.js 16 (App Router, React Server Components by default)
- **Language:** TypeScript — `strict: true`, `noUncheckedIndexedAccess: true`, no `any`
- **Styling:** Tailwind CSS v4 (using the `@theme` directive and CSS variables, not v3 config files)
- **Components:** shadcn/ui (copy into `components/ui/`, don't install as a dep)
- **Icons:** lucide-react
- **Animation:** Motion (the new framer-motion) — used sparingly, never on critical render path
- **i18n:** next-intl
- **Forms & validation:** react-hook-form + zod
- **Cart state (RFQ basket):** Zustand with `localStorage` persistence
- **Email delivery:** Resend (handles the quote inquiry email to Nitro Plus)
- **Catalog data:** start with typed constants in `lib/products.ts` or MDX in `content/products/`. Graduate to a headless CMS (Sanity / Payload) only when the catalog passes ~50 SKUs and the owner wants to edit it without a deploy.
- **Package manager:** pnpm
- **Hosting:** **Vercel.** First-class Next.js App Router support, automatic `next/image` optimization, edge regions in the GCC. Netlify would also work but is a step behind on Next.js adapter parity.

### Explicitly NOT in the stack

- ❌ Stripe / any payment processor
- ❌ Shopify / WooCommerce / Medusa / any transactional e-commerce platform
- ❌ Inventory management system
- ❌ Auth provider (no login, no accounts at launch)
- ❌ Order / fulfillment / shipping logic

---

## 4. Architecture Rules

### Server vs Client Components

- **Default to Server Components.** Add `"use client"` ONLY when the component needs state, effects, event handlers, or browser-only APIs.
- Data fetching happens in Server Components or Route Handlers. Never fetch in `useEffect`.
- When you need interactivity (inquiry form, locale switcher, mobile nav), wrap the smallest possible leaf in a client component. Don't mark whole pages as client.

### File Structure

```
app/
  [locale]/                  # i18n routing (en, ar)
    page.tsx                 # home — hero + trust + sourcing + inquiry CTA (NO category browse, see §9 + §9a)
    about/page.tsx           # our story + experience
    careers/page.tsx         # "always looking for talent" + apply CTA (email + WhatsApp)
    shop/
      page.tsx               # PRIMARY browse surface — VehicleCategories block + PartCategories block + catalog grid (search, filters)
      [slug]/page.tsx        # individual product page with "Add to Quote"
    quote/
      page.tsx               # RFQ basket: review items, fill contact + vehicle info, submit
    contact/page.tsx
    layout.tsx
  # NOTE: /categories and /parts top-level routes are DEPRECATED. Browse moved into /shop.
  # If those route folders still exist on disk, they're legacy and slated for cleanup.
  api/
    quote/route.ts           # receives RFQ submission, sends email via Resend, returns WhatsApp deep link
components/
  ui/                        # shadcn primitives — don't edit without reason
  sections/                  # Hero, VehicleCategories, PartCategories, Experience, FeaturedProducts, QuoteForm, Footer
  shop/                      # ProductCard, ProductGrid, ProductFilters, AddToQuoteButton, QuoteBasket, QuoteBasketDrawer
  shared/                    # Logo, LocaleSwitcher, WhatsAppButton, QuoteBasketIcon
lib/
  utils.ts                   # cn(), formatters
  constants.ts               # SITE_URL, COMPANY_INFO, VEHICLE_CATEGORIES, PART_CATEGORIES, WHATSAPP_NUMBER
  products.ts                # catalog data (typed constants or loader for MDX) — until CMS
  quote-store.ts             # Zustand store for RFQ basket
  quote-email.ts             # Resend email template + send function
  whatsapp.ts                # helpers for building wa.me deep links
content/                     # MDX or JSON for category copy and (optionally) products
messages/                    # i18n (en.json, ar.json)
public/                      # images, favicons, partner logos
```

### Naming

- Components: `PascalCase.tsx`, one component per file, **named exports** (not default)
- Utilities: `camelCase.ts`
- Constants: `SCREAMING_SNAKE_CASE`
- CSS variables: `--kebab-case`

---

## 5. Design System

### Colors (declared in `globals.css` via `@theme`)

The brand should feel like **forged steel and high-performance fuel** — not pastel, not corporate blue, not chrome-and-purple gamer aesthetic.

- `--color-brand`: primary brand color — [TODO: confirm — suggest a deep, saturated red or signal orange evocative of nitrous / performance, e.g. `oklch(0.62 0.22 28)`]
- `--color-brand-accent`: secondary accent — [TODO: a graphite/anthracite for industrial weight]
- `--color-surface`: page background — near-white in light mode, near-black in dark
- `--color-surface-elevated`: cards, modals
- `--color-text`: primary text
- `--color-text-muted`: secondary text
- `--color-border`: hairlines, dividers

**Rule:** never use raw hex values in components. Always reference the token (`bg-brand`, `text-muted-foreground`, etc.).

### Spacing

- 4px base scale. Use `p-1, p-2, p-4, p-6, p-8, p-12, p-16, p-24`.
- No arbitrary values (`p-[13px]`) unless there's a documented reason.
- Section vertical rhythm: `py-16 md:py-24 lg:py-32`.
- Container max-width: `max-w-7xl mx-auto px-4 md:px-8`.

### Typography

- **Body (Latin):** Geist, loaded via `next/font/google` in `src/app/layout.tsx`. Wired into `--font-sans` token.
- **Display:** Oswald, loaded via `next/font/google`. Wired into `--font-display` token. Used for the Hero headline, Logo, stat values, button labels — anything that should feel industrial / forged.
- **Body (Arabic):** **unresolved.** Geist is Latin-only, so `/ar` body text currently falls through to the OS Arabic default. **Open task:** wire IBM Plex Sans Arabic (or similar) and gate it on `lang="ar"`. Oswald is also Latin-only — Arabic headlines fall through to OS sans; same applies.
- **Scale:** stick to Tailwind defaults: `text-sm, text-base, text-lg, text-xl, text-2xl, text-4xl, text-6xl`. Don't invent in-between sizes.

### Imagery

- Real product / vehicle photography wherever possible. No generic Unsplash "luxury car at sunset" shots.
- If using stock during build-out, mark every placeholder image with a `data-placeholder` attribute so they're greppable for replacement later.
- No marine / boat / nautical imagery anywhere on this site (see §7).

### Breakpoints

- Mobile-first. Design and verify at **375px first**, then `md` (768px), then `lg` (1024px).

---

## 6. Code Conventions

### TypeScript

- Prefer `type` over `interface` unless you need declaration merging.
- Use discriminated unions for state shapes.
- Never `any`. Use `unknown` and narrow.
- Avoid enums — use `as const` objects.
- Vehicle and part categories live in typed constants in `lib/constants.ts` — never as magic strings.

### React

- Function components only.
- Compute derived state during render. `useEffect` is for syncing with external systems, not for derived values.
- Memoize (`useMemo`, `memo`) only after profiling proves it's needed.
- Suspense boundaries around async server components for proper streaming.

### Styling

- Tailwind utility classes inline.
- For variants, use `class-variance-authority` (cva).
- No CSS-in-JS, no styled-components, no CSS modules.
- RTL: use Tailwind's logical properties (`ps-4` not `pl-4`, `ms-2` not `ml-2`, `text-start` not `text-left`).

---

## 7. Forbidden Patterns

### Code

- ❌ `any` type
- ❌ Inline `style={{...}}` (except truly dynamic values that can't be Tailwind)
- ❌ `useEffect` for data fetching
- ❌ Hardcoded colors in components — use design tokens
- ❌ Hardcoded user-facing strings — everything goes through next-intl
- ❌ Physical CSS properties (`pl-4`, `text-left`) — use logical (`ps-4`, `text-start`) for RTL correctness
- ❌ `dangerouslySetInnerHTML` without a documented reason and sanitization
- ❌ Default exports for components (named exports are greppable and refactor-safe)
- ❌ Client components doing what server components could do

### Content & Brand

- ❌ **Any marine, boat, yacht, nautical, or maritime content.** This was on an earlier version of the site by mistake and must never reappear. We do not trade marine parts.
- ❌ Generic "global trading conglomerate" framing — we are auto parts specialists, not a generic trader.
- ❌ "Fast and Furious" / neon-underglow / chrome-skull aesthetic — we're serious operators, not a meme.
- ❌ Inventing product SKUs, prices, or stock levels. If a product page needs a real catalog, ask before fabricating.
- ❌ Implying certifications, partnerships, or years of operation that haven't been confirmed by the owner.

### Commerce (RFQ model)

**Marketing hero exception (owner override, 2026-05).** The home page hero strip is a curated marketing surface. It may display approximate scale numbers, aspirational reach claims, or rounded business stats (current: "25K+ Parts in Stock", "48H Express Shipping", "120+ Countries Served") at the owner's discretion. **This carve-out applies only to the home page hero.** Every other surface — product cards, category pages, shop catalog, search results, about page, footer — the rules below apply strictly. Do not propagate hero-style claims to product or shop UI.

- ❌ **No "Add to Cart" / "Buy Now" / "Checkout" copy.** The button is "Add to Quote" / "Request Pricing." This is a deliberate honesty signal — we don't pretend to be a transactional shop.
- ❌ No fabricated prices. If a price isn't confirmed by the owner, the product card says "Request quote," full stop.
- ❌ No fake stock indicators ("Only 3 left!", "In stock", "Ships in 2 days") on product cards, catalog rows, or category pages. We don't hold stock. Acceptable copy: "Available to source" or just no stock UI at all.
- ❌ No fake shipping estimates, delivery countdowns, or order tracking UI.
- ❌ No checkout / payment / billing pages or components. If a future task hints at one, push back before building.
- ❌ No user accounts, login screens, "My Orders" pages, or wishlist UI at launch. Add only when explicitly scoped.

---

## 8. Workflow

**Before any non-trivial change:** enter Plan mode (Shift+Tab → Plan), produce a written plan, wait for approval.

**After UI changes:**

1. Run `pnpm typecheck` and `pnpm lint`.
2. Use Playwright MCP to load `localhost:3000` and verify the change visually at 375px, 768px, and 1280px.
3. Verify both `/en` and `/ar` — RTL is a first-class requirement, not a final-check chore.
4. For meaningful UI work, run a Lighthouse + axe-core sweep before declaring done.

**Before committing:**

- All forbidden patterns clean (code AND content)
- No TypeScript errors
- No ESLint errors (warnings OK if documented)
- Both `/en` and `/ar` routes render correctly
- No marine content reintroduced anywhere (grep the diff)

---

## 9. Content Pillars — Home Page

The home page is for trust, scope, and conversion — **not** for browsing the catalog. Vehicle and part category browse lives on `/shop` (see §9a). The home page should be:

1. **Hero** — what we do + the breadth of vehicles we cover + a single clear CTA ("Request a part" / "Contact us"). Marketing stats row carve-out lives here (see §7).
2. **Experience / why us** — years in the industry, depth of knowledge across verticals (from a Hellcat cam swap to a Caterpillar hydraulic line), UAE trade license. This is the trust block and our biggest moat.
3. **Sourcing & special orders** — call this out as its own pillar. The ability to find hard-to-get, NOS, and discontinued parts is genuinely differentiating and worth a dedicated mention.
4. **Inquiry CTA** — a clear path to contact, ideally a short form (vehicle make / model / year + part needed + contact) plus WhatsApp.
5. **Footer** — full company info, locations, license, languages.

## 9a. Content Pillars — Shop Page

`/shop` is the single browse-and-buy surface. Both browse axes (by vehicle, by part) live above the catalog grid.

1. **VehicleCategories** — all ten verticals, grouped visually so the page stays scannable:
   - *Performance:* American muscle, European sport, JDM
   - *Luxury & Exotic:* luxury / premium, exotics & supercars
   - *Off-road & Heavy:* 4×4 / off-road, heavy machinery & commercial
   - *Everyday & EV:* standard passenger, electric & hybrid, classic & vintage
2. **PartCategories** — 16 system blocks (wheels & tires, suspension, engines & forced induction, drivetrain, exhaust, brakes, cooling & fluids, fuel & induction, electrical, ECU tuning, lighting, body & exterior, off-road accessories, interior, general replacement parts, sourcing & special orders). Visual and scannable — not a wall of text.
3. **Catalog grid** — search, filter (by vehicle / part / brand / fitment), product cards with "Add to Quote" buttons. The working surface.

---

## 10. Current Status

- [x] Project scaffold (Next.js 16, TS, Tailwind v4, pnpm)
- [x] CLAUDE.md (this file)
- [ ] Strip all legacy marine content from the existing Replit site
- [x] Design tokens in `globals.css` (brand, surface, text, border + shadcn mapping + Oswald display)
- [x] shadcn/ui initialized
- [x] i18n routing (`/en`, `/ar`)
- [x] Layout shell — Header, Footer, LocaleSwitcher, WhatsApp floating button, QuoteBasket icon (components exist; finishing/polish ongoing)
- [x] Hero section (v0-integrated, dark-mode default, RTL-correct, hero stats override per §7 carve-out)
- [x] Careers page (generic "always looking for talent" + email/WhatsApp apply CTAs)
- [ ] About / Experience section
- [ ] **Shop catalog** — `/shop` page with VehicleCategories + PartCategories browse blocks + search/filter catalog grid + individual product pages (§9a)
- [ ] Cleanup: delete deprecated `/categories` and `/parts` top-level routes once `/shop` covers their function
- [ ] Cleanup: delete `src/app/globals from v0.css` and `src/app/layout from v0.tsx` reference pastes
- [ ] Arabic body + display fonts (IBM Plex Sans Arabic or equivalent) wired and gated on `lang="ar"`
- [ ] **Quote basket** — Zustand store, `localStorage` persistence, drawer or page UI
- [ ] **RFQ submission** — `/quote` page form, `api/quote` route, Resend email template, WhatsApp deep-link generator
- [ ] Contact page (separate from RFQ — general inquiries)
- [ ] SEO: metadata, sitemap.xml, robots.txt, JSON-LD (Organization + LocalBusiness + Product where applicable)
- [ ] Lighthouse pass (≥ 90 across all four)
- [ ] Deployment to Vercel with custom domain

---

## 11. Context Claude Should NOT Lose

- **This is an auto parts business.** Not a generic trader, not a marine supplier, not a logistics company. Every decision — copy, imagery, structure, schema — should reinforce automotive expertise.
- **This is a quote catalog, not a shop.** No payments, no checkout, no stock counts. "Add to Quote" → email + WhatsApp → human reply. If a future task drifts toward Stripe, inventory, or order tracking, push back before building.
- **Ten verticals, not one.** Don't collapse 4×4, muscle, luxury, exotic, European sport, JDM, heavy machinery, classic, EV, and standard into a single generic "cars" bucket. The breadth is the entire selling point — a workshop that can talk Hellcat cams, Patrol lift kits, *and* Cat hydraulic lines is rare.
- **Sixteen-ish product systems.** Wheels, tires, suspension, engines, forced induction, drivetrain, exhaust, brakes, cooling, fuel, electrical, ECU tuning, lighting, body, off-road accessories, interior, general parts, and sourcing. Don't quietly drop categories to make a layout tidier — ask first.
- **Sourcing is a product, not a side note.** The ability to find hard-to-get / NOS / discontinued parts is part of the offering. Treat it that way.
- **Experience is the moat.** Years of industry knowledge is what separates Nitro Plus from a website-and-a-warehouse competitor. Lean into it in copy.
- **Arabic is not an afterthought.** Every section must look as good in RTL as LTR. The Arabic user is a primary user, not a translated user.
- **Performance is non-negotiable.** Many visitors are on mobile networks in the GCC. No heavy hero videos, no carousel libraries with 200KB of JS, no autoplaying engine-rev sound effects.
- **Trust signals matter more than animation.** UAE trade license, real address, real phone, real WhatsApp, real years of operation, real partner / brand logos (only when confirmed).
- **No marine content. Ever.** This is the single most repeated rule in this file because it has already been a mistake once.