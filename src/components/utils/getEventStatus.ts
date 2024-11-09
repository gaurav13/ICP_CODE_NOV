import { EventStatus } from '@/types/article';

export default function getVariant(vStatus: string): EventStatus {
  switch (vStatus) {
    case 'all':
      return { all: null };
    case 'upcoming':
      return { upcoming: null };
    case 'past':
      return { past: null };
    case 'ongoing':
      return { ongoing: null };
    default:
      return { all: null };
  }
}
