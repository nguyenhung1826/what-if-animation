import React from 'react';
import { Composition } from 'remotion';
import '../engine/fonts';
import { STUDIO } from '../studio.config';
import { SwitchOffSleepThumbs, THUMB_COUNT } from './SwitchOffSleep';
import { DepthDemo } from './DepthDemo';
import { FeelPainThumbs, FEEL_PAIN_THUMBS } from './FeelPain';

export const ThumbsRoot: React.FC = () => (
  <>
  <Composition id="DepthDemo" component={DepthDemo} durationInFrames={90}
    width={STUDIO.width} height={STUDIO.height} fps={STUDIO.fps} />
  <Composition id="FeelPainThumbs" component={FeelPainThumbs} durationInFrames={FEEL_PAIN_THUMBS}
    width={STUDIO.width} height={STUDIO.height} fps={STUDIO.fps} />
  <Composition id="SwitchOffSleepThumbs" component={SwitchOffSleepThumbs} durationInFrames={THUMB_COUNT}
    width={STUDIO.width} height={STUDIO.height} fps={STUDIO.fps} />
  </>
);
