import React from 'react';

export interface CardProps {
    title?: string;
    children?: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 rounded px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h1 className='mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl'>{title}</h1>
            <p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300'>
            {children}
            </p>
                
        </div>
    );
}