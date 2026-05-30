-- On first sign-in (new auth.users row), seed:
--   * preferences row (defaults: MYR / zh-CN / today view)
--   * 9 preset categories (Chinese names + i18n_key so labels localize)
-- SECURITY DEFINER so the trigger can insert into RLS-protected tables
-- regardless of session.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.preferences (user_id) values (new.id);

  insert into public.categories (user_id, name, i18n_key, kind, icon, color) values
    (new.id, '餐饮',  'food',          'expense', 'utensils',   '#F97316'),
    (new.id, '交通',  'transport',     'expense', 'car',        '#3B82F6'),
    (new.id, '账单',  'bills',         'expense', 'receipt',    '#A855F7'),
    (new.id, '娱乐',  'entertainment', 'expense', 'gamepad-2',  '#EC4899'),
    (new.id, '医疗',  'healthcare',    'expense', 'heart-pulse','#EF4444'),
    (new.id, '其他',  'other',         'expense', 'circle',     '#737373'),
    (new.id, '工资',  'salary',        'income',  'wallet',     '#16A34A'),
    (new.id, '奖金',  'bonus',         'income',  'gift',       '#22C55E'),
    (new.id, '投资',  'investment',    'income',  'trending-up','#10B981');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
