# B-roll for the portfolio (Google Flow, Veo 3.1)

Five silent loops, one per slot. Generate each in [Google Flow](https://labs.google/flow) with
**Veo 3.1**, **16:9**, **8 s**, then run `scripts/encode-broll.sh` on the downloads and commit the
output in `public/broll/`. The site picks them up on the next build; until then each slot shows
its vector motion graphic, so nothing breaks while a clip is missing.

House style for every clip (paste it after each prompt):

> Dark navy background (#0b0f17), violet (#8b5cf6) and cyan (#22d3ee) light only, no other
> colours. Abstract, no people, no faces, no text, no logos, no UI with readable words. Slow,
> continuous camera move with no cuts, so the clip loops cleanly. Cinematic, shallow depth of
> field, soft volumetric glow, fine film grain. Silent.

| Slot (file name) | Where it plays | Prompt |
| --- | --- | --- |
| `hero` | Behind the hero, under the 3D terrain | Slow aerial glide over an endless landscape of glowing data pillars rising and falling like a living city at night; thin light trails flow between the pillars like traffic. |
| `systems` | Scene cut into **02 Systems** | Macro shot travelling along translucent glass pipelines; luminous data packets stream through them, split at junctions, pass through softly pulsing processing nodes, and merge again. |
| `projects` | Scene cut into **05 Projects** | Slow orbit around floating holographic blueprint panels and wireframe cubes assembling themselves piece by piece in mid-air, like a product being built. |
| `experience` | Scene cut into **06 Experience** | Low dolly move along a timeline of light: a row of crystal towers grows taller one after another as the camera passes, each tower brighter than the last. |
| `contact` | Scene cut into **09 Contact** | Hundreds of thin threads of light drift in from the edges of frame and converge into one bright point at the centre, which gently pulses. |

## After generating

```bash
# one clip per slot, named after the slot
bash scripts/encode-broll.sh ~/Downloads/hero.mp4 hero
bash scripts/encode-broll.sh ~/Downloads/systems.mp4 systems
# … projects, experience, contact
git add public/broll && git commit -m "Add b-roll loops" && git push
```

Each clip is re-encoded to a ~1–2 MB WebM plus an MP4 fallback and a poster frame, with audio
removed. Clips download only when they scroll near the viewport and pause whenever they are
off-screen or the visitor pauses animations.
