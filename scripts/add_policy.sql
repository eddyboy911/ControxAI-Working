-- Enable RLS on calls table (in case it wasn't)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Policy for Organization Members to view their own organization's calls
CREATE POLICY "Enable read access for organization members" ON "public"."calls"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  (organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ))
);

-- Policy for Super Admins (if not using organization_members) is already added? 
-- Let's add a robust one just in case.
CREATE POLICY "Enable read access for super admins" ON "public"."calls"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  (NOT (EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_members.user_id = auth.uid()
  )))
);
