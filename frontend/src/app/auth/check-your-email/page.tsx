import { Suspense } from 'react';
import CheckYourEmailClient from './client';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckYourEmailClient />
    </Suspense>
  );
}
