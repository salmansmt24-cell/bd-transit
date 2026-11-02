import {NextRequest,NextResponse} from 'next/server';import {adminDb} from './supabase';
export async function authorized(req:NextRequest){const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)return false;const db=adminDb();const {data,error}=await db.auth.getUser(token);if(error||!data.user?.email)return false;const emails=(process.env.ADMIN_EMAILS??'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);return emails.includes(data.user.email.toLowerCase());}
export const forbidden=()=>NextResponse.json({error:'Unauthorized'},{status:403});
