-- Alimentación complementaria — esquema inicial
-- Correr una sola vez en el SQL Editor de Supabase, antes de seed_alimentos.sql.

create extension if not exists pgcrypto;

create table if not exists alimentos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  grupo text not null check (grupo in ('cereal', 'fruta', 'verdura', 'proteina')),
  subgrupo text not null check (
    subgrupo in (
      'dura', 'blanda', 'semillas', 'hojas_verdes',
      'cereal', 'cereal_infantil_fortificado',
      'origen_animal', 'leguminosa', 'oleaginosa'
    )
  ),
  es_alergenico boolean not null default false,
  alergeno_categoria text check (
    alergeno_categoria in (
      'leche', 'huevo', 'soya', 'trigo_gluten',
      'mani', 'frutos_secos', 'pescado', 'mariscos'
    )
  ),
  nombres_alternos text
);

create table if not exists recetas (
  id uuid primary key default gen_random_uuid(),
  alimento_id uuid references alimentos(id) on delete cascade,
  subgrupo text,
  ingredientes text,
  pasos text not null,
  notas text,
  -- una receta es puntual (alimento_id) o genérica de subgrupo, no ambas ni ninguna
  constraint recetas_alimento_o_subgrupo check (
    (alimento_id is not null and subgrupo is null) or
    (alimento_id is null and subgrupo is not null)
  )
);

create table if not exists registros_comida (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  tiempo_comida text not null check (tiempo_comida in ('desayuno', 'almuerzo', 'cena')),
  alimento_id uuid not null references alimentos(id),
  cantidad text,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists registros_comida_alimento_idx on registros_comida (alimento_id);
create index if not exists registros_comida_fecha_idx on registros_comida (fecha);

alter table alimentos enable row level security;
alter table recetas enable row level security;
alter table registros_comida enable row level security;

-- alimentos y recetas: catálogo de solo lectura para cualquier usuario autenticado
create policy "alimentos_select_authenticated" on alimentos
  for select using (auth.role() = 'authenticated');

create policy "recetas_select_authenticated" on recetas
  for select using (auth.role() = 'authenticated');

-- registros_comida: lectura y escritura para cualquier usuario autenticado
-- (una sola cuenta compartida — no hay distinción de usuarios dentro de la app)
create policy "registros_all_authenticated" on registros_comida
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
