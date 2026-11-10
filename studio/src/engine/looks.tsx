import React from 'react';
import { LOOKS, Look, tone } from './rig';
import { LookDef } from './episode';
import { HudChip } from './ui';

// Power looks (how a power changes the picture while it runs) and named costumes that more than one episode uses.
// A power look goes in an episode's defineEpisode({ looks }); a costume is a Look for <Hero look={...} />.

// ---------- power looks ----------

// OFF (switch-off-sleep): the picture goes cold and a touch darker (the lamp has died), an OFF chip with a power icon
// blinks. In the shot: the lamp 1 -> 0, the hero as { ...LOOKS.hero, faceGlow: true } with glint 1 and glintColor
// ice blue (#9FE4FF), the switch_off sound.
export const offLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.3 * lv}) hue-rotate(${-12 * lv}deg) brightness(${1 - 0.06 * lv}) contrast(${1 + 0.06 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="OFF" icon="power" />,
};

// ---------- costumes (approved by the user on the switch-off-sleep storyboards; faces untouched) ----------

/** Mum at home in the morning: white tone, dusty-rose dressing gown, plum pyjama trousers, pink slippers, dark bob. */
export const MOM_GOWN: Look = { ...tone(LOOKS.mom, 'white'), coat: 'long', jacket: '#B7737F', jacketShade: '#9A5C68', sleeve: '#B7737F', accent: '#F2D5DA', limb: '#5A4A6A', shoe: '#E9B9C2', hair: '#4A2A22' };
/** The little sister in teal pyjamas, black tone, coral slippers. Draw at 0.7 of an adult. */
export const SIS_PJS: Look = { ...tone(LOOKS.sis, 'black'), jacket: '#3E8C86', jacketShade: '#2F6E69', sleeve: '#3E8C86', limb: '#357A75', accent: '#F2C14E', shoe: '#F28C6A', hair: '#3A2E44' };
/** Mo, the friend: black tone, olive bomber, mustard accent, dark curls. */
export const MO_BOMBER: Look = { ...tone(LOOKS.mo, 'black'), coat: 'bomber', jacket: '#5E6E46', jacketShade: '#4C5A38', sleeve: '#5E6E46', accent: '#E9C46A', hair: '#2A2430' };
/** The teacher: white tone, brown tweed blazer, green tie, grey hair. */
export const TEACHER_TWEED: Look = { ...tone(LOOKS.suit, 'white'), jacket: '#7A5A3A', jacketShade: '#62482E', sleeve: '#7A5A3A', accent: '#2F6A4A', limb: '#3A3446', hair: '#8A8A90' };
/** The man in the suit, black tone (charcoal suit, red tie). */
export const SUIT_BLACK: Look = tone(LOOKS.suit, 'black');
