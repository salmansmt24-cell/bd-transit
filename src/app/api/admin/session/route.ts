import {NextRequest,NextResponse} from 'next/server';
import {authorized,verifyCredentials,sessionCookie,adminCookieName} from '@/lib/admin';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){return NextResponse.json({authenticated:authorized(req)},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:NextRequest){
 try{const body=await req.json();if(typeof body.email!=='string'||typeof body.password!=='string'||body.password.length>1024)return NextResponse.json({error:'Invalid credentials'},{status:401});
 if(!verifyCredentials(body.email,body.password))return NextResponse.json({error:'Invalid credentials'},{status:401});
 const res=NextResponse.json({authenticated:true});res.cookies.set(adminCookieName,sessionCookie(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*3600});return res;
 }catch{return NextResponse.json({error:'Invalid request'},{status:400})}
}
export async function DELETE(){const res=NextResponse.json({ok:true});res.cookies.set(adminCookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return res}
