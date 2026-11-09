import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 } from './shots';

// Chapter 5: the twist, the real cost. The power stays on (the hero's glowing eyes, drawn in the shots); no grade, the
// night bedroom and the schematic carry the mood.
export const switchOffSleep5 = defineEpisode('SwitchOffSleep5', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 },
  looks: {},
});
