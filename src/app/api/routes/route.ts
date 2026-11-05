import {NextRequest,NextResponse} from 'next/server';import {getRoutes,getFares} from '@/lib/data';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){try{const q=req.nextUrl.searchParams;const routes=await getRoutes(q.get('from')??'',q.get('to')??'',q.get('mode')??'all');const fares=await getFares(routes.map(r=>r.id));return NextResponse.json({routes,fares,source:'published database',live:false});}catch{return NextResponse.json({error:'Unable to fetch routes'},{status:503})}}
