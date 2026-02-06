-- ============================================================
-- Migrate existing auth.users -> user_profiles
-- ============================================================

-- Cria user_profiles para todos os usuarios existentes que ainda nao tem perfil
INSERT INTO public.user_profiles (id, email, role, is_active)
SELECT
  au.id,
  au.email,
  'usuario',
  true
FROM auth.users au
LEFT JOIN public.user_profiles up ON up.id = au.id
WHERE up.id IS NULL;

-- ============================================================
-- Para promover um usuario a super_admin, execute manualmente:
--
--   UPDATE public.user_profiles
--   SET role = 'super_admin'
--   WHERE email = 'seu-email@exemplo.com';
--
-- ============================================================
