-- Fix: Allow new users to create their own profile (self-registration)
-- This solves the chicken-and-egg problem where INSERT policy required
-- an existing role, but new users have no profile yet.

-- Add policy: user can INSERT their own profile (auth.uid() = id)
CREATE POLICY "profiles_self_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (
    id = auth.uid()
  );
