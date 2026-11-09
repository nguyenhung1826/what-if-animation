import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 } from './shots';

// Chapter 4: the first crack. The power stays on in the shots (the hero's glowing eyes) until the microsleep on the
// stairs, where the glow flickers out; no grade.
export const switchOffSleep4 = defineEpisode('SwitchOffSleep4', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 },
  looks: {},
});
