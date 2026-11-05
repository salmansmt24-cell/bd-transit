import {NextRequest,NextResponse} from 'next/server';
import {createHmac,scryptSync,timingSafeEqual} from 'node:crypto';
const cookieName='bd_admin_session';
function secret(){return process.env.ADMIN_SESSION_SECRET??''}
function sign(value:string){return createHmac('sha256',secret()).update(value).digest('base64url')}
export function authorized(req:NextRequest){
 if(secret().length<32)return false;
 const token=req.cookies.get(cookieName)?.value;
 if(!token)return false;
 const parts=token.split('.');if(parts.length!==2)return false;
 const [payload,signature]=parts;
 const expected=Buffer.from(sign(payload));const got=Buffer.from(signature);
 if(expected.length!==got.length||!timingSafeEqual(expected,got))return false;
 try{const data=JSON.parse(Buffer.from(payload,'base64url').toString());return data.role==='admin'&&Number(data.exp)>Date.now()}catch{return false}
}
export function verifyCredentials(email:string,password:string){
 const allowed=(process.env.ADMIN_EMAIL??'').trim().toLowerCase();
 const encoded=process.env.ADMIN_PASSWORD_HASH??'';
 if(!allowed||!encoded||email.trim().toLowerCase()!==allowed||secret().length<32)return false;
 const [salt,hash]=encoded.split(':');if(!salt||!hash||!/^[a-f0-9]{64}$/i.test(hash))return false;
 const actual=scryptSync(password,salt,32);const expected=Buffer.from(hash,'hex');
 return timingSafeEqual(actual,expected);
}
export function sessionCookie(){const payload=Buffer.from(JSON.stringify({role:'admin',exp:Date.now()+8*3600*1000})).toString('base64url');return `${payload}.${sign(payload)}`}
export const forbidden=()=>NextResponse.json({error:'Unauthorized'},{status:403});
export const adminCookieName=cookieName;
