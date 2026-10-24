import { wedding } from '@/config/wedding.config';
import { asset } from '@/lib/asset';
import { couple } from '@/lib/couple';
import { longDate } from '@/lib/date';

/** Panel foto besar di kiri, hanya untuk layar laptop/desktop. HP tetap satu kolom. */
export default function DesktopAside() {
  return (
    <aside className="fixed inset-y-0 left-0 right-[30rem] hidden overflow-hidden lg:block" aria-hidden>
      <img src={asset(wedding.coverImage)} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-14 text-white">
        <p className="text-xs uppercase tracking-[0.35em] opacity-80">The Wedding of</p>
        <p className="mt-3 font-script text-7xl leading-tight">
          {couple[0].nickname} &amp; {couple[1].nickname}
        </p>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] opacity-80">{longDate(wedding.events[0].date, wedding.timezone)}</p>
        {wedding.couple.hashtag && <p className="mt-2 text-sm opacity-70">{wedding.couple.hashtag}</p>}
      </div>
    </aside>
  );
}
