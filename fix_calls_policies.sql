-- =============================================
-- FIX: Calls RLS Policy for Super Admins
-- =============================================
-- Problem: Super Admins (who are not members of any organization) 
-- cannot see calls because the default policy likely restricts 
-- access to "users belonging to the call's organization".
--
-- Solution: Add a policy that allows users with NO organization membership 
-- (defined as Super Admins in this system) to SELECT all calls.
-- =============================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'calls' AND policyname = 'Allow super admins to view all calls'
    ) THEN
        -- 1. Enable RLS on calls (ensure it's on)
        ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

        -- 2. Policy: Allow Super Admins to VIEW ALL calls
        -- Logic: If the user does NOT exist in organization_members, they are a Super Admin.
        CREATE POLICY "Allow super admins to view all calls"
        ON public.calls
        FOR SELECT
        USING (
            NOT EXISTS (
                SELECT 1 FROM organization_members 
                WHERE organization_members.user_id = auth.uid()
            )
        );
    END IF;
END $$;

-- 3. (Optional) Policy: Allow Super Admins to INSERT/UPDATE calls (if needed for testing)
-- CREATE POLICY "Allow super admins to manage calls"
-- ON public.calls
-- FOR ALL
-- USING (
--   NOT EXISTS (
--     SELECT 1 FROM organization_members 
--     WHERE organization_members.user_id = auth.uid()
--   )
-- );
