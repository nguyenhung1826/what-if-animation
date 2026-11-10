import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as S from './shots';

// Chapter 4 of "What if you could feel everyone's pain?": the job only you can do; the ending.
export const feelPain4 = defineEpisode('FeelPain4', { timeline: timeline as Timeline, shots: S as any, looks: {} });
