import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 } from './shots';

// Chapter 6: the choice and the Part 1 cliffhanger. The power is still on, drawn in the shots (the hero's glowing
// eyes); no grade. The blackout on "day twelve" is the rooftop's own lightsOut + blackout, then black.
export const switchOffSleep6 = defineEpisode('SwitchOffSleep6', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 },
  looks: {},
});
