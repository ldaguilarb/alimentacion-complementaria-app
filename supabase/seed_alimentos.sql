-- Alimentación complementaria — catálogo de alimentos y recetas
-- Correr después de schema.sql. Fuente: 01_base_tecnica/temas/texturas_por_edad.md y
-- calendario_introduccion.md (guía CIENutrition + criterio nutricional revisado por Luis).
--
-- Nota: los alergenos "trigo_gluten" solo se marcaron en los alimentos donde el trigo es
-- inequívoco (cereal de trigo, pan, pasta). Tortilla/arepa/pancake/waffle quedaron sin marcar
-- por ser receta-dependientes (pueden ser de maíz) — revisar y ajustar si hace falta.

insert into alimentos (nombre, grupo, subgrupo, es_alergenico, alergeno_categoria, nombres_alternos) values
-- Frutas
('Manzana', 'fruta', 'dura', false, null, null),
('Pera', 'fruta', 'dura', false, null, null),
('Guayaba', 'fruta', 'dura', false, null, null),
('Guanábana', 'fruta', 'semillas', false, null, null),
('Granadilla', 'fruta', 'semillas', false, null, null),
('Maracuyá', 'fruta', 'semillas', false, null, null),
('Banano', 'fruta', 'blanda', false, null, 'Plátano (México), cambur (Venezuela)'),
('Melón', 'fruta', 'blanda', false, null, null),
('Durazno', 'fruta', 'blanda', false, null, null),
('Ciruelas', 'fruta', 'blanda', false, null, null),
('Arándano azul', 'fruta', 'blanda', false, null, null),
('Frambuesa', 'fruta', 'blanda', false, null, null),
('Fresa', 'fruta', 'blanda', false, null, null),
('Higo', 'fruta', 'blanda', false, null, null),
('Kiwi', 'fruta', 'blanda', false, null, null),
('Mandarina', 'fruta', 'blanda', false, null, null),
('Mango', 'fruta', 'blanda', false, null, null),
('Mora/Zarzamora', 'fruta', 'blanda', false, null, null),
('Naranja', 'fruta', 'blanda', false, null, null),
('Papaya', 'fruta', 'blanda', false, null, null),
('Piña', 'fruta', 'blanda', false, null, null),
('Sandía', 'fruta', 'blanda', false, null, null),
('Uvas', 'fruta', 'blanda', false, null, null),

-- Verduras
('Guatila', 'verdura', 'dura', false, null, 'Chayote, chayota, chuchú, güisquil, papa del aire'),
('Auyama', 'verdura', 'dura', false, null, 'Zapallo, calabaza, güicoy, butternut squash'),
('Remolacha', 'verdura', 'dura', false, null, 'Betabel, betarraga'),
('Zanahoria', 'verdura', 'dura', false, null, null),
('Berenjena', 'verdura', 'dura', false, null, null),
('Brócoli', 'verdura', 'dura', false, null, null),
('Coliflor', 'verdura', 'dura', false, null, null),
('Zucchini', 'verdura', 'dura', false, null, 'Calabacita, calabacín'),
('Habichuelas', 'verdura', 'dura', false, null, 'Ejote'),
('Arveja verde', 'verdura', 'dura', false, null, 'Chícharo'),
('Espárragos', 'verdura', 'dura', false, null, null),
('Pimentón', 'verdura', 'dura', false, null, 'Pimiento, chile morrón'),
('Rábano', 'verdura', 'dura', false, null, null),
('Apio', 'verdura', 'dura', false, null, null),
('Champiñones', 'verdura', 'dura', false, null, null),
('Setas', 'verdura', 'dura', false, null, null),
('Cebolla', 'verdura', 'dura', false, null, null),
('Repollo', 'verdura', 'dura', false, null, null),
('Pepino', 'verdura', 'dura', false, null, null),
('Tomate', 'verdura', 'dura', false, null, null),
('Acelga', 'verdura', 'hojas_verdes', false, null, null),
('Espinaca', 'verdura', 'hojas_verdes', false, null, null),
('Aguacate', 'verdura', 'blanda', false, null, null),

-- Cereales (incluye tubérculos y cereal infantil fortificado, unificados por decisión de Luis)
('Arroz', 'cereal', 'cereal', false, null, null),
('Quinoa', 'cereal', 'cereal', false, null, null),
('Cuscús', 'cereal', 'cereal', false, null, null),
('Pasta', 'cereal', 'cereal', true, 'trigo_gluten', null),
('Amaranto', 'cereal', 'cereal', false, null, null),
('Avena', 'cereal', 'cereal', false, null, null),
('Cebada', 'cereal', 'cereal', false, null, null),
('Centeno', 'cereal', 'cereal', false, null, null),
('Cereal de arroz', 'cereal', 'cereal', false, null, null),
('Cereal de avena', 'cereal', 'cereal', false, null, null),
('Cereal de trigo', 'cereal', 'cereal', true, 'trigo_gluten', null),
('Hojuelas de maíz', 'cereal', 'cereal', false, null, null),
('Mazorca', 'cereal', 'cereal', false, null, 'Elote'),
('Pan', 'cereal', 'cereal', true, 'trigo_gluten', null),
('Pancake casero', 'cereal', 'cereal', false, null, null),
('Tortilla', 'cereal', 'cereal', false, null, null),
('Waffle casero', 'cereal', 'cereal', false, null, null),
('Arepa', 'cereal', 'cereal', false, null, null),
('Camote', 'cereal', 'dura', false, null, 'Batata, boniato, papa dulce'),
('Papa blanca', 'cereal', 'dura', false, null, null),
('Papa criolla', 'cereal', 'dura', false, null, null),
('Plátano verde', 'cereal', 'dura', false, null, null),
('Yuca', 'cereal', 'dura', false, null, null),
('Cereal infantil fortificado', 'cereal', 'cereal_infantil_fortificado', false, null, 'Producto comercial — revisar que no tenga azúcares añadidos y esté fortificado con hierro y zinc'),

-- Proteínas
('Carne de res', 'proteina', 'origen_animal', false, null, null),
('Pollo', 'proteina', 'origen_animal', false, null, null),
('Róbalo', 'proteina', 'origen_animal', true, 'pescado', null),
('Salmón', 'proteina', 'origen_animal', true, 'pescado', null),
('Atún', 'proteina', 'origen_animal', true, 'pescado', null),
('Huevo de gallina', 'proteina', 'origen_animal', true, 'huevo', null),
('Hígado de pollo', 'proteina', 'origen_animal', false, null, null),
('Camarón', 'proteina', 'origen_animal', true, 'mariscos', null),
('Carne de cerdo', 'proteina', 'origen_animal', false, null, null),
('Pavo', 'proteina', 'origen_animal', false, null, null),
('Queso fresco', 'proteina', 'origen_animal', true, 'leche', null),
('Yogur natural sin azúcar', 'proteina', 'origen_animal', true, 'leche', null),
('Frijol', 'proteina', 'leguminosa', false, null, null),
('Frijol blanco', 'proteina', 'leguminosa', false, null, 'Alubias'),
('Garbanzo', 'proteina', 'leguminosa', false, null, null),
('Habas', 'proteina', 'leguminosa', false, null, null),
('Lentejas', 'proteina', 'leguminosa', false, null, null),
('Soya (Tofu)', 'proteina', 'leguminosa', true, 'soya', null),
('Almendras', 'proteina', 'oleaginosa', true, 'frutos_secos', null),
('Maní', 'proteina', 'oleaginosa', true, 'mani', 'Cacahuate'),
('Marañón', 'proteina', 'oleaginosa', true, 'frutos_secos', 'Nuez de la India'),
('Nuez pecana', 'proteina', 'oleaginosa', true, 'frutos_secos', null),
('Pistachos', 'proteina', 'oleaginosa', true, 'frutos_secos', null);

-- Recetas genéricas por subgrupo (fallback cuando un alimento no tiene receta puntual)
insert into recetas (subgrupo, pasos, notas) values
('dura', 'Cocinar al vapor en trozos pequeños (sin tocar el agua) 10 a 15 minutos o hasta que esté blando. Triturar con licuadora de inmersión, agregando agua poco a poco solo si hace falta. Para papilla, licuar más tiempo hasta consistencia homogénea; para machacado, menos tiempo y textura más heterogénea.', 'Nunca sal, pimienta, azúcar, miel ni condimentos.'),
('blanda', 'No requiere cocción. Escoger la fruta bien madura. Machacar con tenedor, machacador o licuadora según la blandura, hasta la consistencia deseada.', null),
('semillas', 'Retirar la cáscara y ofrecer la pulpa junto con las semillas pequeñas (cubierta gelatinosa, sin riesgo). Machacar o licuar.', 'Nunca ofrecer en jugo.'),
('hojas_verdes', 'Retirar los tallos. Cocinar al vapor 3 a 5 minutos. Triturar con licuadora de inmersión.', null),
('cereal', 'Lavar bajo el chorro de agua. Cocinar en agua hirviendo de forma tradicional. Una vez cocido, triturar con licuadora de inmersión o moler con tenedor; si el grano es pequeño puede dejarse en su forma natural para el machacado.', 'Sin sal, consomé en polvo ni ningún otro condimento.'),
('cereal_infantil_fortificado', 'Agregar leche humana, fórmula infantil o agua poco a poco, revolviendo con cuchara hasta lograr una mezcla grumosa.', 'Revisar que el empaque no tenga azúcares añadidos y esté fortificado con hierro y zinc.'),
('origen_animal', 'Cocinar completamente en sartén u horno antes de modificar la presentación (filetes/pescado 65°C, carnes molidas y aves 75°C). Triturar con licuadora de inmersión, agregando agua poco a poco solo si hace falta.', null),
('leguminosa', 'Cocinar hirviendo, igual que un cereal. Triturar con licuadora de inmersión o machacar.', 'No es necesario limitarse solo al caldo — es un mito.'),
('oleaginosa', 'Tostar y moler hasta lograr una crema o mantequilla suave.', 'Siempre en crema/mantequilla, nunca enteras ni en trozos — alto riesgo de atragantamiento.');

-- Recetas puntuales (transcripción fiel de las 4 recetas de ejemplo de la fuente)
insert into recetas (alimento_id, ingredientes, pasos, notas)
select id, '1 manzana partida, sin semillas',
  'Hervir agua en una olla pequeña y colocar una rejilla para cocción al vapor. Colocar los trozos de manzana sobre la rejilla sin tocar el agua, cocinar 10 a 15 minutos o hasta que esté blanda. Triturar con licuadora de inmersión, agregando agua poco a poco solo si es necesario.',
  'Otra fruta que se prepara igual es la pera o cualquier otra fruta dura.'
from alimentos where nombre = 'Manzana';

insert into recetas (alimento_id, ingredientes, pasos, notas)
select id, '1 zanahoria sin cáscara',
  'Mismo método al vapor que la manzana. Cocinar aproximadamente 15 minutos o hasta que esté blanda. Triturar igual.',
  'Otras verduras que se preparan de manera similar: guatila, auyama, remolacha o cualquier otra que sea dura.'
from alimentos where nombre = 'Zanahoria';

insert into recetas (alimento_id, ingredientes, pasos, notas)
select id, '½ taza de arroz crudo',
  'Lavar el arroz crudo bajo el chorro de agua. Cocinarlo tradicionalmente. Una vez cocido, triturar con licuadora de inmersión, agregando agua poco a poco solo si es necesario. El machacado también puede lograrse moliendo con tenedor.',
  'Otros cereales que se preparan de manera similar: quinoa, cuscús y pastas.'
from alimentos where nombre = 'Arroz';

insert into recetas (alimento_id, ingredientes, pasos, notas)
select id, '1 hígado de pollo crudo',
  'Limpiar el hígado y cortarlo en trozos pequeños. Cocinarlo en un sartén antiadherente hasta que esté completamente cocido. Triturar con licuadora de inmersión, agregando agua poco a poco solo si es necesario.',
  'Otros alimentos de origen animal que se preparan de manera similar: carne de res, pollo, pescado, huevo, entre otros.'
from alimentos where nombre = 'Hígado de pollo';
