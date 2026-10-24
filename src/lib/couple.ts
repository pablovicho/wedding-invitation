import { wedding } from '@/config/wedding.config';

const { bride, groom, order } = wedding.couple;

/** Pasangan sesuai urutan di config */
export const couple = order === 'bride-first' ? ([bride, groom] as const) : ([groom, bride] as const);
export const coupleNames = `${couple[0].nickname} & ${couple[1].nickname}`;
export const mainEvent = wedding.events[0];
