# Alimentación complementaria (app)

App personal para seguir la alimentación complementaria del bebé: registro diario de comidas,
calendario de introducción de alimentos (con seguimiento de alergénicos), guía de preparación por
alimento, y contador de consumo. React + Vite + TypeScript + Tailwind, datos en Supabase.

La base técnica clínica y el diseño de producto de esta app viven en el workspace de planeación
[`alimentacion-complementaria`](../alimentacion-complementaria) (no en este repo).

## Setup

1. **Supabase**
   - Crear un proyecto en [supabase.com](https://supabase.com) (plan free).
   - En el SQL Editor, correr en orden: `supabase/schema.sql` y luego `supabase/seed_alimentos.sql`.
   - En Authentication → Users, crear el único usuario compartido (email + password que van a usar
     los dos) — no hay self-signup en la app.
   - Copiar el **Project URL** y la **anon public key** (Settings → API).

2. **Local**
   ```bash
   npm install
   cp .env.example .env.local   # completar con los valores de Supabase
   npm run dev
   ```

3. **Deploy (GitHub Pages)**
   - Repo → Settings → Secrets and variables → Actions: cargar `VITE_SUPABASE_URL` y
     `VITE_SUPABASE_ANON_KEY`.
   - Repo → Settings → Pages: source = "GitHub Actions".
   - Push a `main` → el workflow `.github/workflows/deploy.yml` builda y publica el sitio.
   - Si el repo tiene otro nombre que no sea `alimentacion-complementaria-app`, ajustar `base` en
     `vite.config.ts` para que coincida (`/nombre-del-repo/`).

## Scripts

- `npm run dev` — servidor local
- `npm run build` — typecheck + build de producción
- `npm run lint` — oxlint
