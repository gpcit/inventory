import Chart from 'chart.js';
import React from 'react';
import Link from "next/link";
import { CardSkeleton } from '@/components/ui/skeleton';

import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function Home() {
  
  return (
    <>
    <main>
    <Link href="/dashboard">
      <span>Go to Dashboard</span>
      </Link>
    
    </main>
    </>
  );
}
