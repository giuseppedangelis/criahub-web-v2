create index if not exists idx_reproduction_protocols_created_by
  on public.reproduction_protocols (created_by);

create index if not exists idx_sales_auction_id
  on public.sales (auction_id);

create index if not exists idx_storage_files_user_id
  on public.storage_files (user_id);

drop policy if exists reproduction_protocol_steps_write_policy on public.reproduction_protocol_steps;
drop policy if exists reproduction_protocol_steps_insert_policy on public.reproduction_protocol_steps;
drop policy if exists reproduction_protocol_steps_update_policy on public.reproduction_protocol_steps;
drop policy if exists reproduction_protocol_steps_delete_policy on public.reproduction_protocol_steps;
create policy reproduction_protocol_steps_insert_policy
on public.reproduction_protocol_steps
for insert
to public
with check (
  exists (
    select 1
    from public.reproduction_protocols rp
    where rp.id = reproduction_protocol_steps.protocol_id
      and public.user_can_manage_haras_data(rp.haras_id)
  )
);

create policy reproduction_protocol_steps_update_policy
on public.reproduction_protocol_steps
for update
to public
using (
  exists (
    select 1
    from public.reproduction_protocols rp
    where rp.id = reproduction_protocol_steps.protocol_id
      and public.user_can_manage_haras_data(rp.haras_id)
  )
)
with check (
  exists (
    select 1
    from public.reproduction_protocols rp
    where rp.id = reproduction_protocol_steps.protocol_id
      and public.user_can_manage_haras_data(rp.haras_id)
  )
);

create policy reproduction_protocol_steps_delete_policy
on public.reproduction_protocol_steps
for delete
to public
using (
  exists (
    select 1
    from public.reproduction_protocols rp
    where rp.id = reproduction_protocol_steps.protocol_id
      and public.user_can_manage_haras_data(rp.haras_id)
  )
);
