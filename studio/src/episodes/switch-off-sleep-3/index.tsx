import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 } from './shots';

// Chapter 3: the kitchen. The power is on the whole chapter, drawn in the shots (the hero's glowing eyes); no grade.
export const switchOffSleep3 = defineEpisode('SwitchOffSleep3', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 },
  looks: {},
});
