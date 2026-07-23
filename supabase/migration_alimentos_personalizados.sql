-- Migración: soporte para alimentos personalizados
-- Correr en el SQL Editor de Supabase después del schema inicial.

-- 1. Ampliar el constraint de subgrupo para incluir 'otro'
ALTER TABLE alimentos DROP CONSTRAINT IF EXISTS alimentos_subgrupo_check;
ALTER TABLE alimentos ADD CONSTRAINT alimentos_subgrupo_check CHECK (
  subgrupo IN (
    'dura', 'blanda', 'semillas', 'hojas_verdes',
    'cereal', 'cereal_infantil_fortificado',
    'origen_animal', 'leguminosa', 'oleaginosa',
    'otro'
  )
);

-- 2. Añadir columnas para alimentos personalizados
ALTER TABLE alimentos ADD COLUMN IF NOT EXISTS preparacion_personalizada TEXT;
ALTER TABLE alimentos ADD COLUMN IF NOT EXISTS is_personalizado BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Permitir a usuarios autenticados insertar alimentos
CREATE POLICY "alimentos_insert_authenticated" ON alimentos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Permitir borrar solo alimentos marcados como personalizados
CREATE POLICY "alimentos_delete_personalizado" ON alimentos
  FOR DELETE USING (auth.role() = 'authenticated' AND is_personalizado = TRUE);
