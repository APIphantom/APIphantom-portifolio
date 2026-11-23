-- Upload and register project media with the authenticated admin session.
-- The application checks public.has_role(auth.uid(), 'admin') before these calls.

create policy "media_admin_select"
on public.media
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "media_admin_insert"
on public.media
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "media_admin_update"
on public.media
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "media_admin_delete"
on public.media
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "media_bucket_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
  and public.has_role(auth.uid(), 'admin')
);

create policy "media_bucket_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.has_role(auth.uid(), 'admin')
);

create policy "media_bucket_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and public.has_role(auth.uid(), 'admin')
)
with check (
  bucket_id = 'media'
  and public.has_role(auth.uid(), 'admin')
);

create policy "media_bucket_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and public.has_role(auth.uid(), 'admin')
);
