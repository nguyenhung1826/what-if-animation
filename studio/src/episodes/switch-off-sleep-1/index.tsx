import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 } from './shots';

// The power's look, OFF: the picture goes cold and a touch darker (the lamp has died), an OFF chip with a power icon
// blinks. The glowing eyes are drawn in the shots (the hero with faceGlow and an ice-blue glint), the lamp dying is
// the shot's own `lamp` 1 -> 0, the click is the switch_off sound.
export const offLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.3 * lv}) hue-rotate(${-12 * lv}deg) brightness(${1 - 0.06 * lv}) contrast(${1 + 0.06 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="OFF" icon="power" />,
};

export const switchOffSleep1 = defineEpisode('SwitchOffSleep1', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 },
  looks: { off: offLook },
});
