'use client';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function GalleryLightbox({
  index,
  slides,
  onClose,
}: {
  index: number;
  slides: { src: string; alt: string }[];
  onClose: () => void;
}) {
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      slides={slides}
      carousel={{ finite: false, preload: 1 }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      styles={{ container: { backgroundColor: 'rgba(0,0,0,.92)' } }}
    />
  );
}
