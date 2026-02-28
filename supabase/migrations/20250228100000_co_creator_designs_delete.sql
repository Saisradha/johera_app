-- Allow users to delete their own designs
CREATE POLICY "Users can delete own designs" ON co_creator_designs
  FOR DELETE USING (auth.uid() = user_id);
