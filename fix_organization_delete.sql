-- =============================================
-- FIX: Organization Delete & Cascade
-- =============================================
-- This script fixes:
-- 1. RLS policy to allow super admins to DELETE organizations
-- 2. CASCADE delete for agents when organization is deleted
-- 3. UPDATE policy for organizations (bonus)
-- =============================================

-- 1. Allow super admins to DELETE organizations
CREATE POLICY "Allow super admins to delete organizations"
ON organizations
FOR DELETE
USING (
  -- Super admin: user has NO organization membership
  NOT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.user_id = auth.uid()
  )
);

-- 2. Allow super admins to UPDATE organizations (for edit feature)
CREATE POLICY "Allow super admins to update organizations"
ON organizations
FOR UPDATE
USING (
  NOT EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.user_id = auth.uid()
  )
);

-- 3. Setup CASCADE delete for agents
-- First, drop the existing foreign key constraint
ALTER TABLE agents 
DROP CONSTRAINT IF EXISTS agents_organization_id_fkey;

-- Recreate it with CASCADE delete
ALTER TABLE agents
ADD CONSTRAINT agents_organization_id_fkey 
FOREIGN KEY (organization_id) 
REFERENCES organizations(id) 
ON DELETE CASCADE;

-- Verify policies
SELECT 
    tablename,
    policyname,
    cmd as command
FROM pg_policies 
WHERE tablename IN ('organizations', 'agents')
ORDER BY tablename, cmd;
