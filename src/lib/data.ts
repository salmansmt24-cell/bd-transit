import {db} from './db';
import type {Place,Route,Fare,Tracking,Mode} from './types';
export async function getPlaces():Promise<Place[]> {
 const sql=db();if(!sql)return [];
 const rows=await sql`select id,name_bn,name_en,district from places where published=true order by name_en limit 1000`;
 return rows as unknown as Place[];
}
export async function getRoutes(from?:string,to?:string,mode?:string):Promise<Route[]> {
 const sql=db();if(!sql)return [];
 const rows=await sql`select r.id,r.mode,r.name_bn,r.name_en,r.operator_name,r.verified_at,r.source_url,
 json_build_object('id',o.id,'name_bn',o.name_bn,'name_en',o.name_en,'district',o.district) as origin,
 json_build_object('id',d.id,'name_bn',d.name_bn,'name_en',d.name_en,'district',d.district) as destination
 from routes r join places o on o.id=r.origin_id join places d on d.id=r.destination_id
 where r.published=true and o.published=true and d.published=true
 and (${mode==='bus'||mode==='train'?mode:null}::text is null or r.mode=${mode==='bus'||mode==='train'?mode:null})
 order by r.name_en limit 300`;
 const ids=rows.map(r=>String(r.id));
 const stops=ids.length?await sql`select s.route_id,s.stop_order,p.id,p.name_bn,p.name_en,p.district
 from route_stops s join places p on p.id=s.place_id
 where s.route_id in ${sql(ids)} and p.published=true order by s.route_id,s.stop_order`:[];
 const list=rows.map(r=>({...r,stops:stops.filter(s=>s.route_id===r.id).map(s=>({id:s.id,name_bn:s.name_bn,name_en:s.name_en,district:s.district}))})) as unknown as Route[];
 const matches=(p:Place,s?:string)=>!s||[p.name_bn,p.name_en,p.district??''].some(v=>v.toLowerCase().includes(s.trim().toLowerCase()));
 return list.filter(r=>{const points=[r.origin,...r.stops,r.destination];const a=from?points.findIndex(p=>matches(p,from)):-1;const b=to?points.findLastIndex(p=>matches(p,to)):-1;return (!from||a>=0)&&(!to||b>=0)&&(!from||!to||a<b)});
}
export async function getFares(routeIds:string[]):Promise<Fare[]> {
 const sql=db();if(!sql||!routeIds.length)return [];
 const rows=await sql`select f.id,f.route_id,f.class_name,f.amount_bdt::float8 as amount_bdt,f.verified_at,f.source_url
 from fares f join routes r on r.id=f.route_id where f.published=true and r.published=true and f.route_id in ${sql(routeIds)} order by f.amount_bdt limit 1000`;
 return rows as unknown as Fare[];
}
export async function getTracking(vehicleId:string):Promise<Tracking|null>{
 const sql=db();if(!sql)return null;
 const rows=await sql`select l.vehicle_id,l.latitude,l.longitude,l.recorded_at,l.source_name
 from vehicle_locations l join vehicles v on v.id=l.vehicle_id
 join routes r on r.id=v.route_id
 where l.vehicle_id=${vehicleId} and v.gps_authorized=true and r.published=true
 and l.recorded_at <= now() and l.recorded_at >= now()-interval '5 minutes'
 order by l.recorded_at desc limit 1`;
 return (rows[0] as unknown as Tracking|undefined)??null;
}
