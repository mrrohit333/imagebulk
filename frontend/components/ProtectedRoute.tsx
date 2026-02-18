'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        const ok = isAuthenticated();
        setAuthed(ok);
        setMounted(true);
        if (!ok) {
            router.push('/login');
        }
    }, [router]);

    // Before mount: render nothing (same on server & client → no hydration mismatch)
    if (!mounted) return null;

    // After mount: only render children if authenticated
    if (!authed) return null;

    return <>{children}</>;
}
