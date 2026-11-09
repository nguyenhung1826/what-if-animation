import React from 'react';
import { Composition } from 'remotion';
import '../engine/fonts';
import { STUDIO } from '../studio.config';
import { SwitchOffSleepThumbs, THUMB_COUNT } from './SwitchOffSleep';

export const ThumbsRoot: React.FC = () => (
  <Composition id="SwitchOffSleepThumbs" component={SwitchOffSleepThumbs} durationInFrames={THUMB_COUNT}
    width={STUDIO.width} height={STUDIO.height} fps={STUDIO.fps} />
);
