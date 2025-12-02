-- Create storage bucket for merchant assets (logos, product images)
-- Note: This needs to be run in Supabase SQL editor as storage bucket creation
-- requires special permissions

INSERT INTO storage.buckets (id, name, public)
VALUES ('merchant-assets', 'merchant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'merchant-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'merchant-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'merchant-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to all files in the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'merchant-assets');
