import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as S from './shots';

// Chapter 3 of "What if you could feel everyone's pain?": it's real (the science), then the doctor.
export const feelPain3 = defineEpisode('FeelPain3', { timeline: timeline as Timeline, shots: S as any, looks: {} });
