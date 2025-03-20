-- Create user_role enum type
CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'manager'
);

-- Create tables
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" public.user_role DEFAULT 'manager'::public.user_role NOT NULL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category_id" INTEGER REFERENCES "categories"("id"),
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "image_url" TEXT NOT NULL,
  "is_main" BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "hero_images" (
  "id" SERIAL PRIMARY KEY,
  "image_url" TEXT NOT NULL,
  "title" TEXT,
  "subtitle" TEXT,
  "button_text" TEXT,
  "button_link" TEXT,
  "order" INTEGER DEFAULT 0,
  "is_active" BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS "contact_requests" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "message" TEXT,
  "request_call_back" BOOLEAN DEFAULT false,
  "status" TEXT DEFAULT 'new',
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" SERIAL PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "value" TEXT
); 