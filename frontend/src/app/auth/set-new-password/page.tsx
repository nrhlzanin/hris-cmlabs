import { Suspense } from 'react';
import SetNewPasswordClient from './SetNewPasswordClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetNewPasswordClient />
    </Suspense>
  );
}
