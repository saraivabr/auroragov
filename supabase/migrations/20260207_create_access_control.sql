-- ============================================================
-- Access Control: organizations + user_profiles + RLS
-- ============================================================

-- 1. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  tipo        text NOT NULL DEFAULT 'prefeitura'
              CHECK (tipo IN ('prefeitura','secretaria','autarquia','fundacao','empresa_publica','outro')),
  cnpj        text UNIQUE,
  email_contato text,
  telefone    text,
  endereco    text,
  cidade      text,
  estado      text CHECK (estado IS NULL OR length(estado) = 2),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            text,
  email           text,
  role            text NOT NULL DEFAULT 'usuario'
                  CHECK (role IN ('super_admin','gestor','usuario')),
  organization_id uuid REFERENCES public.organizations(id),
  created_by      uuid REFERENCES auth.users(id),
  is_active       boolean NOT NULL DEFAULT true,
  telefone        text,
  cargo           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Helper functions (SECURITY DEFINER = bypass RLS)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.user_profiles WHERE id = auth.uid();
$$;

-- 4. updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. RLS Policies: organizations
-- ============================================================

-- SELECT: super_admin ve todas; gestor/usuario ve so a propria
CREATE POLICY "orgs_select" ON public.organizations
  FOR SELECT USING (
    public.get_user_role() = 'super_admin'
    OR id = public.get_user_organization_id()
  );

-- INSERT: somente super_admin
CREATE POLICY "orgs_insert" ON public.organizations
  FOR INSERT WITH CHECK (
    public.get_user_role() = 'super_admin'
  );

-- UPDATE: somente super_admin
CREATE POLICY "orgs_update" ON public.organizations
  FOR UPDATE USING (
    public.get_user_role() = 'super_admin'
  );

-- DELETE: somente super_admin
CREATE POLICY "orgs_delete" ON public.organizations
  FOR DELETE USING (
    public.get_user_role() = 'super_admin'
  );

-- ============================================================
-- 6. RLS Policies: user_profiles
-- ============================================================

-- SELECT: super_admin ve todos; gestor ve os que criou + ele mesmo; usuario ve so ele
CREATE POLICY "profiles_select" ON public.user_profiles
  FOR SELECT USING (
    public.get_user_role() = 'super_admin'
    OR id = auth.uid()
    OR (public.get_user_role() = 'gestor' AND created_by = auth.uid())
  );

-- INSERT: super_admin pode criar qualquer; gestor pode criar (via edge function)
CREATE POLICY "profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'gestor' AND created_by = auth.uid())
  );

-- UPDATE: super_admin pode tudo; gestor pode atualizar os que criou; usuario pode atualizar ele mesmo
CREATE POLICY "profiles_update" ON public.user_profiles
  FOR UPDATE USING (
    public.get_user_role() = 'super_admin'
    OR id = auth.uid()
    OR (public.get_user_role() = 'gestor' AND created_by = auth.uid())
  );

-- DELETE: somente super_admin
CREATE POLICY "profiles_delete" ON public.user_profiles
  FOR DELETE USING (
    public.get_user_role() = 'super_admin'
  );
