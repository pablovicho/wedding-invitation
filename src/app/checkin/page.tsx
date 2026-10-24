import type { Metadata } from 'next';
import Checkin from './Checkin';

export const metadata: Metadata = {
  title: 'Check-in Tamu',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Checkin />;
}
