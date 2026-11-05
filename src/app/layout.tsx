import type {Metadata} from 'next';import {Suspense} from 'react';import './globals.css';
export const metadata:Metadata={title:{default:'BD Transit | Bangladesh Bus & Train Routes',template:'%s | BD Transit'},description:'Find published bus and train routes, stops, fares and GPS availability across Bangladesh.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bn"><body><Suspense fallback={null}>{children}</Suspense></body></html>}
