-- =========================================================
-- SCHEMA POSTGRESQL
-- Projeto: Achei — Achados e Perdidos do Campus
-- Banco: PostgreSQL
-- =========================================================

-- =========================================================
-- EXTENSÕES
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- ENUMS
-- =========================================================

CREATE TYPE item_status AS ENUM (
  'disponivel',
  'devolvido'
);

-- =========================================================
-- TABELA: item_categories
-- Categorias dos itens encontrados
-- =========================================================

CREATE TABLE item_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Categorias iniciais
INSERT INTO item_categories (name, slug) VALUES
  ('Eletrônico', 'eletronico'),
  ('Documento', 'documento'),
  ('Vestuário', 'vestuario'),
  ('Outro', 'outro');

-- =========================================================
-- TABELA: found_items
-- Itens encontrados no campus
-- =========================================================

CREATE TABLE found_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title VARCHAR(120) NOT NULL,
  description TEXT,

  category_id UUID NOT NULL REFERENCES item_categories(id),

  status item_status NOT NULL DEFAULT 'disponivel',

  -- Salvar somente a URL/path da foto.
  -- A imagem em si deve ficar em um storage externo.
  photo_url TEXT NOT NULL,

  -- Local onde o item foi encontrado
  found_location_text VARCHAR(255) NOT NULL,
  found_latitude DECIMAL(10, 8),
  found_longitude DECIMAL(11, 8),

  -- Data em que o item foi encontrado
  found_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT found_items_latitude_range CHECK (
    found_latitude IS NULL OR found_latitude BETWEEN -90 AND 90
  ),

  CONSTRAINT found_items_longitude_range CHECK (
    found_longitude IS NULL OR found_longitude BETWEEN -180 AND 180
  )
);

-- =========================================================
-- TABELA: item_returns
-- Registro de devolução dos itens
-- =========================================================

CREATE TABLE item_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  item_id UUID NOT NULL UNIQUE REFERENCES found_items(id) ON DELETE CASCADE,

  returned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  observation TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =========================================================
-- ÍNDICES
-- =========================================================

-- Buscar itens por status
CREATE INDEX idx_found_items_status
ON found_items(status);

-- Buscar itens por categoria
CREATE INDEX idx_found_items_category_id
ON found_items(category_id);

-- Buscar itens disponíveis por categoria
CREATE INDEX idx_found_items_status_category_id
ON found_items(status, category_id);

-- Ordenar itens pela data em que foram encontrados
CREATE INDEX idx_found_items_found_at
ON found_items(found_at DESC);

-- Busca textual por título e descrição
CREATE INDEX idx_found_items_search
ON found_items
USING GIN (
  to_tsvector(
    'portuguese',
    coalesce(title, '') || ' ' || coalesce(description, '')
  )
);

-- =========================================================
-- FUNÇÃO/TRIGGER: atualizar updated_at automaticamente
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_found_items_updated_at
BEFORE UPDATE ON found_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- FUNÇÃO/TRIGGER: marcar item como devolvido ao registrar devolução
-- =========================================================

CREATE OR REPLACE FUNCTION mark_item_as_returned()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE found_items
  SET status = 'devolvido',
      updated_at = NOW()
  WHERE id = NEW.item_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mark_item_as_returned
AFTER INSERT ON item_returns
FOR EACH ROW
EXECUTE FUNCTION mark_item_as_returned();

-- =========================================================
-- QUERIES ÚTEIS PARA TESTE
-- =========================================================

-- Listar categorias
-- SELECT
--   id,
--   name,
--   slug
-- FROM item_categories
-- ORDER BY name ASC;

-- Criar item encontrado
-- INSERT INTO found_items (
--   title,
--   description,
--   category_id,
--   photo_url,
--   found_location_text,
--   found_latitude,
--   found_longitude
-- ) VALUES (
--   'Carteira preta',
--   'Carteira encontrada perto da biblioteca.',
--   'UUID_DA_CATEGORIA',
--   'https://storage.exemplo.com/fotos/carteira.jpg',
--   'Biblioteca central',
--   -10.94720000,
--   -37.07310000
-- );

-- Listar itens disponíveis
-- SELECT
--   fi.id,
--   fi.title,
--   fi.description,
--   fi.status,
--   fi.photo_url,
--   fi.found_location_text,
--   fi.found_latitude,
--   fi.found_longitude,
--   fi.found_at,
--   ic.id AS category_id,
--   ic.name AS category_name,
--   ic.slug AS category_slug
-- FROM found_items fi
-- JOIN item_categories ic ON ic.id = fi.category_id
-- WHERE fi.status = 'disponivel'
-- ORDER BY fi.found_at DESC;

-- Filtrar por categoria
-- SELECT
--   fi.id,
--   fi.title,
--   fi.description,
--   fi.photo_url,
--   fi.found_location_text,
--   fi.found_at,
--   ic.name AS category_name,
--   ic.slug AS category_slug
-- FROM found_items fi
-- JOIN item_categories ic ON ic.id = fi.category_id
-- WHERE fi.status = 'disponivel'
--   AND ic.slug = 'eletronico'
-- ORDER BY fi.found_at DESC;

-- Buscar por texto
-- SELECT
--   fi.id,
--   fi.title,
--   fi.description,
--   fi.photo_url,
--   fi.found_location_text,
--   fi.found_at,
--   ic.name AS category_name
-- FROM found_items fi
-- JOIN item_categories ic ON ic.id = fi.category_id
-- WHERE fi.status = 'disponivel'
--   AND to_tsvector(
--     'portuguese',
--     coalesce(fi.title, '') || ' ' || coalesce(fi.description, '')
--   ) @@ plainto_tsquery('portuguese', 'carteira');

-- Ver detalhe de um item
-- SELECT
--   fi.id,
--   fi.title,
--   fi.description,
--   fi.status,
--   fi.photo_url,
--   fi.found_location_text,
--   fi.found_latitude,
--   fi.found_longitude,
--   fi.found_at,
--   fi.created_at,
--   fi.updated_at,
--   ic.id AS category_id,
--   ic.name AS category_name,
--   ic.slug AS category_slug
-- FROM found_items fi
-- JOIN item_categories ic ON ic.id = fi.category_id
-- WHERE fi.id = 'UUID_DO_ITEM';

-- Marcar item como devolvido
-- INSERT INTO item_returns (
--   item_id,
--   observation
-- ) VALUES (
--   'UUID_DO_ITEM',
--   'Item retirado pelo aluno após confirmação.'
-- );

-- Ver devoluções
-- SELECT
--   ir.id,
--   ir.returned_at,
--   ir.observation,
--   fi.id AS item_id,
--   fi.title AS item_title,
--   fi.photo_url
-- FROM item_returns ir
-- JOIN found_items fi ON fi.id = ir.item_id
-- ORDER BY ir.returned_at DESC;
