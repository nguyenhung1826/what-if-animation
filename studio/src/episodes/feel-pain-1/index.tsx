import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as S from './shots';

// Chapter 1 of "What if you could feel everyone's pain?". The power is drawn in the shots (red rings, throbs).
export const feelPain1 = defineEpisode('FeelPain1', { timeline: timeline as Timeline, shots: S as any, looks: {} });
