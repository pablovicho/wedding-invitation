import DesktopAside from '@/components/DesktopAside';
import Invitation from '@/components/Invitation';
import { InvitationProvider } from '@/components/InvitationProvider';
import Closing from '@/components/sections/Closing';
import Couple from '@/components/sections/Couple';
import Events from '@/components/sections/Events';
import Gallery from '@/components/sections/Gallery';
import Gift from '@/components/sections/Gift';
import GuestQR from '@/components/sections/GuestQR';
import Hero from '@/components/sections/Hero';
import LiveStream from '@/components/sections/LiveStream';
import Opening from '@/components/sections/Opening';
import Photobooth from '@/components/sections/Photobooth';
import Playlist from '@/components/sections/Playlist';
import Rsvp from '@/components/sections/Rsvp';
import Story from '@/components/sections/Story';
import Wishes from '@/components/sections/Wishes';

export default function Home() {
  return (
    <InvitationProvider>
      <Invitation>
        <DesktopAside />
        <main className="relative z-10 mx-auto max-w-phone lg:mr-0 lg:w-[30rem] lg:max-w-none lg:shadow-[-20px_0_60px_-30px_rgb(0_0_0/0.4)]">
          <Hero />
          {/* <Opening /> */}
          <Couple />
          <Events />
          <GuestQR />
          <Story />
          <Gallery />
          <Photobooth />
          <LiveStream />
          <Rsvp />
          <Wishes />
          <Gift />
          <Playlist />
          <Closing />
        </main>
      </Invitation>
    </InvitationProvider>
  );
}
