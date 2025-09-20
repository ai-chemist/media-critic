import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export const metadata = {
    title: 'Media Critic',
    description: 'Media Critic Project',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='ko'>
        <body className='min-h-screen bg-gray-600 text-purple-400'>
        <QueryClientProvider client={queryClient}>
            <header className='border-b bg-gray-100'>
                <div className='mx-auto max-w-5xl p-4 font-bold'>Media Critic</div>
            </header>
            <main className='mx-auto max-w-5xl p-4'>{children}</main>
        </QueryClientProvider>
        </body>
        </html>
    )
}