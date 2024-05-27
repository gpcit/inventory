// components/ProtectedRoute.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if ( status === 'unauthenticated' && !session ) {
      router.push(`/login`);
      
    }
  }, [status, router, session]);
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'authenticated' && session) {
    return children;
  }
  

  return null;
};

export default ProtectedRoute;
