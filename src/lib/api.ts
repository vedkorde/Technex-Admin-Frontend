export type Role = 'super_admin' | 'coordinator' | 'event_coordinator';
export type User = {id:string; email:string; name:string|null; role:Role; tabs?:string[]; active?:boolean; created_by?:string|null; events?:string[]};
export type Registration = {id:string; event:string; rowNumber:number; registrationId:string; timestamp:string|null; teamName:string; teamSize:number; participantCount:number; name:string; email:string; phone:string; college:string; branch:string; year:string; totalAmount:number; utr:string; paymentStatus:string; duplicateUtr:boolean; screenshotLink:string};
export type Totals = {registrations:number; participants:number; revenue:number};
export type Stats = {totals:Totals; byEvent:({event:string}&Totals)[]; daily:{date:string;registrations:number;revenue:number}[]; byCollege:({label:string}&Totals)[]; byBranch:({label:string}&Totals)[]; payment:{utrSubmitted:number;utrMissing:number;duplicateUtr:number;screenshotMissing:number}; fetchedAt:string};
export type EventsResult = {events:({name:string}&Totals)[];fetchedAt:string};
export type RegistrationResult = {data:Registration[];total:number;page:number;pages:number;limit:number;fetchedAt:string};
export type Session = {access_token:string;refresh_token:string;expires_at:number;user:User};
const base = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:4000'
).replace(/\/+$/, ''); // Same-origin API: one URL, one Railway service
const key = 'technex-admin-session';
export function loadSession():Session|null { if(typeof window==='undefined')return null;try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null} }
export function saveSession(s:Session|null){if(typeof window==='undefined')return;if(s)sessionStorage.setItem(key,JSON.stringify(s));else sessionStorage.removeItem(key)}
export class ApiError extends Error {constructor(message:string,public status:number){super(message)}}
async function raw(path:string,init:RequestInit={},token?:string){
 const h = new Headers(init.headers); if(init.body && !(init.body instanceof FormData))h.set('Content-Type','application/json');if(token)h.set('Authorization',`Bearer ${token}`);
 const response=await fetch(`${base}/api${path}`,{...init,headers:h,cache:'no-store'});
 if(!response.ok){let message=`Request failed (${response.status})`;try{const j=await response.json();message=j.error||j.message||message}catch{}throw new ApiError(message,response.status)}return response;
}
export async function login(email:string,password:string):Promise<Session>{return (await raw('/auth/login',{method:'POST',body:JSON.stringify({email,password})})).json()}
export async function refresh(refresh_token:string){return (await raw('/auth/refresh',{method:'POST',body:JSON.stringify({refresh_token})})).json() as Promise<Pick<Session,'access_token'|'refresh_token'|'expires_at'>>}
export async function api<T>(path:string,token:string,init:RequestInit={}):Promise<T>{return (await raw(path,init,token)).json()}
export async function csv(path:string,token:string){const response=await raw(path,{},token);return response.blob()}
export function query(params:Record<string,string|number|boolean|undefined>){const p=new URLSearchParams();Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==''&&v!==false)p.set(k,String(v))});return p.toString()}
