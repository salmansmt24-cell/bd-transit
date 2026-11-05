import type {Lang} from './i18n';
export type Params={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function filters(p:Params['searchParams']){const q=await p;const str=(k:string)=>typeof q[k]==='string'?q[k] as string:'';return {lang:(str('lang')==='en'?'en':'bn') as Lang,from:str('from'),to:str('to'),mode:str('mode')||'all'};}
