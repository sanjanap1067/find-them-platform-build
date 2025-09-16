-- Enable Row Level Security on all tables
ALTER TABLE missing_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Create sightings table for public reports
CREATE TABLE IF NOT EXISTS public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES missing_children(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_phone TEXT,
  reporter_email TEXT,
  sighting_date DATE NOT NULL,
  sighting_location TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;

-- Policies for missing_children (public read, NGO/police write)
CREATE POLICY "Anyone can view active missing children cases" 
  ON missing_children FOR SELECT 
  USING (status = 'active');

CREATE POLICY "NGOs and police can manage cases" 
  ON missing_children FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ngo', 'police')
      AND profiles.is_verified = true
    )
  );

-- Policies for profiles (users can manage their own)
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policies for sightings (public can report, NGOs can manage)
CREATE POLICY "Anyone can report sightings" 
  ON sightings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "NGOs and police can view all sightings" 
  ON sightings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ngo', 'police')
      AND profiles.is_verified = true
    )
  );

CREATE POLICY "NGOs and police can update sightings" 
  ON sightings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ngo', 'police')
      AND profiles.is_verified = true
    )
  );

-- Policies for search_history (users can manage their own)
CREATE POLICY "Users can manage their own search history" 
  ON search_history FOR ALL 
  USING (auth.uid() = user_id);

-- Policies for verification_requests
CREATE POLICY "Users can view their own verification requests" 
  ON verification_requests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests" 
  ON verification_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage verification requests" 
  ON verification_requests FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'public',
    false
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
