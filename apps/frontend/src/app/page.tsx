'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Media } from '@/lib/types';

async function fetchMediaList(): Promise<Media[]> {
    const { data } = await api.get('/media');
    return data;
}

export default function Home() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['mediaList'],
        queryFn: fetchMediaList,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-3'>
            {data?.map((media) => (
                <Link key={media.id} href={`/media/${media.id}`} className='block rounded-3xl border bg-amber-500 p-4 shadow-sm hover:shadow'>
                    <div className='text-lg font-medium'>{media.title}</div>
                    <div className='text-sm text-gray-200'>상세 보기</div>
                </Link>
            ))}
        </div>
    );
}