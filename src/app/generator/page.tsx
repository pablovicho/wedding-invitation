import type { Metadata } from 'next';
import Generator from './Generator';

export const metadata: Metadata = {
  title: 'Generator Link Undangan',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Generator />;
}
