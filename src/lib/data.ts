import { publicDb } from './supabase';
import type {Place,Route,Fare,Tracking,Mode} from './types';
export async function getPlaces():Promise<Place[]> {
 const db=publicDb(); if(!db) return [];
 const {data,error}=await db.from('places').select('id,name_bn,name_en,district').eq('published',true).order('name_en').limit(1000);
 if(error) throw error; return data ?? [];
}
export async function getRoutes(from?:string,to?:string,mode?:string):Promise<Route[]> {
 const db=publicDb(); if(!db) return [];
 let q=db.from('routes').select('id,mode,name_bn,name_en,operator_name,verified_at,source_url,origin:places!routes_origin_id_fkey(id,name_bn,name_en,district),destination:places!routes_destination_id_fkey(id,name_bn,name_en,district),route_stops(stop_order,place:places(id,name_bn,name_en,district))').eq('published',true).order('name_en').limit(300);
 if(mode==='bus'||mode==='train') q=q.eq('mode',mode as Mode);
 const {data,error}=await q; if(error) throw error;
 type Raw=Record<string,unknown>;
 const rows=(data??[]) as unknown as Raw[];
 const list=rows.map(r=>({...r,origin:r.origin as Place,destination:r.destination as Place,stops:((r.route_stops as {stop_order:number;place:Place}[])??[]).sort((a,b)=>a.stop_order-b.stop_order).map(x=>x.place)})) as Route[];
 const matches=(p:Place,s?:string)=>!s||[p.name_bn,p.name_en,p.district??''].some(v=>v.toLowerCase().includes(s.trim().toLowerCase()));
 return list.filter(r=>{
  const points=[r.origin,...r.stops,r.destination];
  const a=from?points.findIndex(p=>matches(p,from)):-1;
  const b=to?points.findLastIndex(p=>matches(p,to)):-1;
  return (!from||a>=0)&&(!to||b>=0)&&(!from||!to||a<b);
 });
}
export async function getFares(routeIds:string[]):Promise<Fare[]> {
 const db=publicDb(); if(!db||!routeIds.length)return [];
 const {data,error}=await db.from('fares').select('id,route_id,class_name,amount_bdt,verified_at,source_url').eq('published',true).in('route_id',routeIds).order('amount_bdt').limit(1000);
 if(error) throw error; return data??[];
}
export async function getTracking(vehicleId:string):Promise<Tracking|null>{
 const db=publicDb();if(!db)return null;
 const {data,error}=await db.from('vehicle_locations').select('vehicle_id,latitude,longitude,recorded_at,source_name').eq('vehicle_id',vehicleId).order('recorded_at',{ascending:false}).limit(1).maybeSingle();
 if(error||!data)return null;
 if(Date.now()-new Date(data.recorded_at).getTime()>5*60*1000)return null;
 return data as Tracking;
}
