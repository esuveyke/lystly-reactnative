/*
  # Insert test data

  1. Sample Items
    - Adds sample links and notes that will be associated with users
    - Creates items with various states (saved, shared)
  
  2. Helper Functions
    - Creates a function to associate items with users when they sign up
    - Sets up triggers to handle data association
*/

-- Create a table to store sample data that will be associated with users when they sign up
CREATE TABLE IF NOT EXISTS sample_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Insert sample link items
INSERT INTO sample_items (id, type, title, url, image_url, is_saved, is_shared, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'link', 'React Native Documentation', 'https://reactnative.dev/docs/getting-started', 'https://reactnative.dev/img/header_logo.svg', true, false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('10000000-0000-0000-0000-000000000003', 'link', 'JavaScript Best Practices', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png', false, false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  ('10000000-0000-0000-0000-000000000005', 'link', 'UI Design Trends 2025', 'https://uxdesign.cc/ui-design-trends-for-2025', 'https://miro.medium.com/max/1400/0*7KFOZKmEUIppOQxH', false, false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('20000000-0000-0000-0000-000000000001', 'link', 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'https://www.typescriptlang.org/images/branding/logo-grouping.svg', true, true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('20000000-0000-0000-0000-000000000003', 'link', 'CSS Grid Guide', 'https://css-tricks.com/snippets/css/complete-guide-grid/', 'https://css-tricks.com/wp-content/uploads/2018/11/grid-template-areas.svg', false, true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  ('30000000-0000-0000-0000-000000000001', 'link', 'Expo Documentation', 'https://docs.expo.dev/', 'https://docs.expo.dev/static/images/og.png', true, true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('30000000-0000-0000-0000-000000000003', 'link', 'React Navigation', 'https://reactnavigation.org/docs/getting-started', 'https://reactnavigation.org/img/spiro.svg', true, false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days');

-- Insert sample note items
INSERT INTO sample_items (id, type, title, content, is_saved, is_shared, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000002', 'note', 'Project Ideas', 'Build a mobile app for tracking daily habits and goals. Include features like reminders, progress tracking, and data visualization.', false, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('10000000-0000-0000-0000-000000000004', 'note', 'Meeting Notes', 'Discussed project timeline and deliverables. Key points: 1) Launch MVP by end of month, 2) Focus on core features first, 3) Schedule weekly progress reviews.', true, true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('20000000-0000-0000-0000-000000000002', 'note', 'Learning Resources', 'Great resources for learning web development:\n- Frontend Masters\n- Egghead.io\n- Kent C. Dodds blog\n- Josh Comeau CSS course', true, false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('30000000-0000-0000-0000-000000000002', 'note', 'App Feature Ideas', 'Features to implement:\n- Dark mode toggle\n- Push notifications\n- Offline support\n- Social sharing\n- User profiles', false, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days');

-- Create a function to copy sample items to a user when they sign up
CREATE OR REPLACE FUNCTION copy_sample_items_to_user()
RETURNS TRIGGER AS $$
DECLARE
  sample_item RECORD;
  new_item_id UUID;
BEGIN
  -- Copy sample items to the new user
  FOR sample_item IN SELECT * FROM sample_items LOOP
    -- Insert the item for the new user
    INSERT INTO items (
      user_id, type, title, url, content, image_url, is_saved, is_shared, created_at, updated_at
    ) VALUES (
      NEW.id, 
      sample_item.type, 
      sample_item.title, 
      sample_item.url, 
      sample_item.content, 
      sample_item.image_url, 
      sample_item.is_saved, 
      sample_item.is_shared, 
      sample_item.created_at, 
      sample_item.updated_at
    )
    RETURNING id INTO new_item_id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically copy sample items when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION copy_sample_items_to_user();

-- Create a function to set up sharing relationships between users
CREATE OR REPLACE FUNCTION setup_sharing_relationships()
RETURNS TRIGGER AS $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user1_items UUID[];
  user2_items UUID[];
  user3_items UUID[];
BEGIN
  -- Find the first three users (for demo purposes)
  SELECT array_agg(id) INTO user1_items
  FROM items
  WHERE user_id = NEW.id
  LIMIT 5;
  
  -- If we have at least one user and some items, we can set up sharing
  IF array_length(user1_items, 1) > 0 THEN
    -- Find other users to share with
    SELECT id INTO user2_id
    FROM auth.users
    WHERE id != NEW.id
    ORDER BY created_at
    LIMIT 1;
    
    SELECT id INTO user3_id
    FROM auth.users
    WHERE id != NEW.id AND id != user2_id
    ORDER BY created_at
    LIMIT 1;
    
    -- If we have other users, set up sharing
    IF user2_id IS NOT NULL THEN
      -- Share the second item with user2
      IF array_length(user1_items, 1) >= 2 THEN
        INSERT INTO shared_items (item_id, shared_by, shared_with, shared_at)
        VALUES (user1_items[2], NEW.id, user2_id, NOW() - INTERVAL '5 days');
      END IF;
      
      -- Share the fourth item with user2
      IF array_length(user1_items, 1) >= 4 THEN
        INSERT INTO shared_items (item_id, shared_by, shared_with, shared_at)
        VALUES (user1_items[4], NEW.id, user2_id, NOW() - INTERVAL '4 days');
      END IF;
    END IF;
    
    -- If we have a third user, share with them too
    IF user3_id IS NOT NULL THEN
      -- Share the fourth item with user3
      IF array_length(user1_items, 1) >= 4 THEN
        INSERT INTO shared_items (item_id, shared_by, shared_with, shared_at)
        VALUES (user1_items[4], NEW.id, user3_id, NOW() - INTERVAL '3 days');
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to set up sharing relationships when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_sharing ON auth.users;
CREATE TRIGGER on_auth_user_created_sharing
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION setup_sharing_relationships();