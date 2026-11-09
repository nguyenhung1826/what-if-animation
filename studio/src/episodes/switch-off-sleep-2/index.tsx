import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 } from './shots';

// Chapter 2: night one. The power is on the whole night, drawn in the shots (the hero's glowing eyes); no grade, so
// the fun part stays warm. offLook (chapter 1) is for the moment of the flip.
export const switchOffSleep2 = defineEpisode('SwitchOffSleep2', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 },
  looks: {},
});
