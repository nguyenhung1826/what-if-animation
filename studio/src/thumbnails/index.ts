import { registerRoot } from 'remotion';
import { ThumbsRoot } from './ThumbsRoot';

// A separate entry point for YouTube thumbnails, so they never touch the episodes' Root.
//   npx remotion still src/thumbnails/index.ts SwitchOffSleepThumbs out/thumbs/A.png --frame=0 --scale=0.6667
registerRoot(ThumbsRoot);
