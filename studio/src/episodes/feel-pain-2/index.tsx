import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as S from './shots';

// Chapter 2 of "What if you could feel everyone's pain?": the world is full of tiny hurts.
export const feelPain2 = defineEpisode('FeelPain2', { timeline: timeline as Timeline, shots: S as any, looks: {} });
