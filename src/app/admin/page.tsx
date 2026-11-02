import AdminConsole from '@/components/admin-console';import type {Metadata} from 'next';
export const metadata:Metadata={title:'Admin Console',robots:{index:false,follow:false}};
export default function Admin(){return <main className="shell min-h-screen py-12"><h1 className="mb-3 text-3xl font-black">BD Transit · Admin</h1><p className="mb-8 text-slate-600">Manage verified transport data. Access is checked server-side for every operation.</p><AdminConsole/></main>}
