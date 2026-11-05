-- Execute in Neon SQL Editor. No fabricated production data is inserted.
create extension if not exists pgcrypto;
create table if not exists public.places (
 id uuid primary key default gen_random_uuid(), name_bn text not null, name_en text not null,
 district text, published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.routes (
 id uuid primary key default gen_random_uuid(), mode text not null check(mode in ('bus','train')),
 name_bn text not null, name_en text not null, operator_name text,
 origin_id uuid not null references public.places(id),destination_id uuid not null references public.places(id),
 source_url text, verified_at timestamptz, published boolean not null default false,
 created_at timestamptz not null default now(),check(origin_id<>destination_id)
);
create table if not exists public.route_stops (
 id uuid primary key default gen_random_uuid(),route_id uuid not null references public.routes(id) on delete cascade,
 place_id uuid not null references public.places(id),stop_order integer not null check(stop_order>0),
 created_at timestamptz not null default now(),unique(route_id,stop_order),unique(route_id,place_id)
);
create table if not exists public.fares (
 id uuid primary key default gen_random_uuid(),route_id uuid not null references public.routes(id) on delete cascade,
 class_name text not null,amount_bdt numeric(10,2) not null check(amount_bdt>=0),
 source_url text,verified_at timestamptz,published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.vehicles (
 id text primary key,route_id uuid references public.routes(id),operator_name text,
 gps_authorized boolean not null default false,created_at timestamptz not null default now()
);
create table if not exists public.vehicle_locations (
 id bigint generated always as identity primary key,vehicle_id text not null references public.vehicles(id) on delete cascade,
 latitude double precision not null check(latitude between -90 and 90),
 longitude double precision not null check(longitude between -180 and 180),
 recorded_at timestamptz not null,source_name text not null,
 created_at timestamptz not null default now()
);
create index if not exists idx_routes_origin_dest on public.routes(origin_id,destination_id);
create index if not exists idx_vehicle_recent on public.vehicle_locations(vehicle_id,recorded_at desc);
create index if not exists idx_route_stops_order on public.route_stops(route_id,stop_order);
