/*
  # Create items schema

  1. New Tables
    - `items` - Stores all user items (links, notes)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, either 'link' or 'note')
      - `title` (text)
      - `url` (text, for link type)
      - `content` (text, for note type)
      - `image_url` (text, optional for link type)
      - `is_saved` (boolean)
      - `is_shared` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `shared_items` - Tracks items shared between users
      - `id` (uuid, primary key)
      - `item_id` (uuid, references items)
      - `shared_by` (uuid, references auth.users)
      - `shared_with` (uuid, references auth.users)
      - `shared_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own items
    - Add policies for users to view items shared with them
*/

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('link', 'note')),
  title text NOT NULL,
  url text,
  content text,
  image_url text,
  is_saved boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shared_items table
CREATE TABLE IF NOT EXISTS shared_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items NOT NULL,
  shared_by uuid REFERENCES auth.users NOT NULL,
  shared_with uuid REFERENCES auth.users NOT NULL,
  shared_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_items ENABLE ROW LEVEL SECURITY;

-- Create policies for items table
-- Users can view their own items
CREATE POLICY "Users can view their own items"
  ON items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view items shared with them
CREATE POLICY "Users can view items shared with them"
  ON items
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT item_id FROM shared_items WHERE shared_with = auth.uid()
    )
  );

-- Users can insert their own items
CREATE POLICY "Users can insert their own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update their own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete their own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for shared_items table
-- Users can view shares they're involved in
CREATE POLICY "Users can view their shares"
  ON shared_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_by OR auth.uid() = shared_with);

-- Users can share their own items
CREATE POLICY "Users can share their own items"
  ON shared_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM items WHERE id = item_id AND user_id = auth.uid()
    )
  );

-- Users can delete shares they created
CREATE POLICY "Users can delete their shares"
  ON shared_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = shared_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS items_user_id_idx ON items (user_id);
CREATE INDEX IF NOT EXISTS items_type_idx ON items (type);
CREATE INDEX IF NOT EXISTS shared_items_shared_with_idx ON shared_items (shared_with);
CREATE INDEX IF NOT EXISTS shared_items_item_id_idx ON shared_items (item_id);