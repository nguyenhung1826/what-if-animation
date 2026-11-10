# Long-form: retention and packaging

How to keep an 8-minute What If video watched to the end, and how to package it so it gets clicked. Read it with
`formula.md` when the person asks for a long-form (chaptered) video, and before making thumbnails. The ideas are
adapted from the MIT-licensed `claude-youtube` skill (github.com/AgriciDaniel/claude-youtube, `script.md`,
`retention-scripting-guide.md`, `thumbnail-ctr-guide.md`); its numbers are third-party rules of thumb, not
measurements of this channel. Check YouTube Studio's retention graph on every upload and trust that over this file.

## The shape of 8 minutes

About 150 spoken words a minute, so an 8-minute video is roughly 1,100-1,250 words across 4 chapters of ~2 min.
Eight minutes is also where YouTube allows mid-roll ads.

| Where | Job | In What If terms |
|---|---|---|
| 0:00-0:05 | Grab | The topic line, spoken over the first picture. No intro, no logo, no "in this video". |
| 0:05-0:15 | Promise | The rule in one line and a flash-forward of the biggest moment still to come ("...and by the end, you'll wish you'd never woken up"). |
| 0:15-0:30 | Stakes | Why it matters to *you*, the viewer: the first demo lands here. |
| ~25% (≈2:00) | Chapter 1 → 2 | Re-hook (below). A soft channel mention is allowed here, never "like and subscribe". |
| ~60% (≈4:50) | The cliff | The most common drop-off. Put the biggest escalation or the turn's fact here, not at the end. |
| last 60 s | Close | The turn lands and the story closes for good (see "Ending"). |

Targets on the retention graph: 70%+ still watching at 0:30. Below about 50% at 0:15 means the hook failed: rewrite
beats 1.1-1.3, not the rest. A steady sag around 40-60% means the middle is slow: cut lines from chapters 2-3.

## Rules for the script

- **Every chapter ends on a forward hook.** The last line of chapter N opens a question chapter N+1 answers ("That was
  the toe. Then you went to the hospital."). Never end a chapter on a summary alone.
- **One open loop always running.** Plant a question early and pay it off late (the flash-forward in 0:05-0:15 is the
  first one). Open the next loop before you close the current one.
- **A pattern interrupt every 30-60 s.** Something new for the eye or ear: a new set, a size jump (wide → extreme
  close-up), a schematic or number card, a music drop to silence, a sound gag, a one-word line ("Ouch."). The shot list
  already cuts fast; this is about a change of *kind* that often.
- **Calm, then burst.** Every 2-3 minutes let one quiet, slower beat breathe (a lone figure, one held line), then hit
  hard. Flat energy across 8 minutes tires people even at a high cut rate. Keep beat holds short anyway
  (see `traps.md`: no dead air).
- **Anchor back to the rule every 2-3 minutes.** One line that restates the power in a fresh way so a viewer who
  drifted can rejoin.
- **Callbacks.** Bring back a small thing from chapter 1 (the roommate, the stubbed toe, a prop) in chapter 3 or 4.
  It rewards the people who stayed and costs nothing: the set and rig are already drawn.
- **Escalate by scale.** Each chapter widens the circle: you → people near you → a city → the world (or the reverse:
  the world → one person). Chapter 2 must be bigger than chapter 1, or the 25% re-hook has nothing to promise.
- **No dead outro lines.** No "thanks for watching", "don't forget to", "let me know in the comments" in the voice.

## Ending

The channel's long-form videos close for good: no part 2, no cliffhanger (`traps.md`). So the last 60 s is the
turn's real fact and a final picture that answers the opening question. The pull to the next video belongs to
YouTube's end screen (the last 5-20 s under a held final shot or the title card), not to the story.

## Title

- Keep the What If line; it is the format and the search term. 40-60 characters so it isn't cut off on phones; the
  hard limit is 100.
- The key word goes in the first half ("What If You Could Feel Everyone's Pain?").
- Optional: a short concrete promise after it, when it's true and shown in the video ("...for One Day",
  "for 24 Hours"). Numbers help when they're real.
- Never write the same words as the thumbnail text.

## Thumbnail

Thumbnails are a separate Remotion entry: `studio/src/thumbnails/` (see `SwitchOffSleep.tsx`, three A/B/C variants
rendered as stills). For a new video add a component there, reusing the episode's sets and cast.

- **One focal point.** The hero, big, mid-reaction. A strong emotion (shock, pain, awe) beats a neutral face; a
  neutral face is worse than none.
- **3 words of text at most** (1-2 is better), in the title face, never repeating the title. The title gives the
  premise; the thumbnail gives the feeling and the "what is happening here?".
- **2-3 colors**, high contrast, 30-40% empty space. The channel's dusk palette with one hot accent (the episode's
  `accent` word color) reads well.
- **Check it small.** Render at 1920×1080 (1280×720 minimum, 16:9, under 2 MB), then look at it at 168×94: if you
  can't tell what is going on, simplify.
- **Three variants that differ in one thing each** (the pose, the text, or the color), for YouTube Studio's
  "Test & Compare" (up to 3, runs up to 2 weeks, judged on watch time share).
- Healthy click-through for education/entertainment is roughly 4-8%; below that after a few days, swap the thumbnail
  before touching the video.

## Checklist before the long-form script goes to the person

1. First 15 s: topic line, rule, flash-forward promise. Nothing else.
2. Every chapter's last line opens the next chapter.
3. An interrupt (new kind of picture or sound) at least every 60 s, marked in the script notes.
4. The biggest moment sits near 60%, not only at the end.
5. At least one callback to chapter 1 in chapter 3 or 4.
6. The ending closes the story; no outro filler.
7. A title (40-60 chars) and three thumbnail ideas (≤3 words each) go with the script for review.
