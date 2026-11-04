import { wedding } from '@/config/wedding.config';

const { bride, groom, order } = wedding.couple;

/** Pareja según el orden en la configuración */
export const couple = order === 'bride-first' ? ([bride, groom] as const) : ([groom, bride] as const);
export const coupleNames = `${couple[0].nickname} & ${couple[1].nickname}`;
export const mainEvent = wedding.events[0];
