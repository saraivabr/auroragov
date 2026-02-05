import { useState } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Toaster } from '@/components/ui/toaster';

export function HomePage() {
  return (
    <>
      <Dashboard />
      <Toaster />
    </>
  );
}
