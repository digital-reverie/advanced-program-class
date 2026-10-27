# Reusing the presentation template

The shared player supplies the title area, slide selector, progress indicator, back/next controls, arrow-key navigation, teacher-note toggle, and full-screen button. A lesson supplies its metadata and slides.

## Basic lesson

```js
export default {
  id: 'loops',
  title: 'Loops',
  subject: 'Advanced Programming',
  description: 'Trace repetition and explain a loop invariant.',
  slides: [
    {
      title: 'The changing value',
      section: 'Explain',
      notes: 'Ask students for a prediction before running the trace.',
      blocks: [
        { type: 'paragraph', text: 'Each iteration updates the current total.' },
        { type: 'code', text: 'int total = 0;\nfor (int i = 1; i <= 3; i++) {\n    total += i;\n}' },
        { type: 'callout', title: 'A useful invariant', text: 'After iteration i, total is the sum of integers from 1 through i.' }
      ]
    }
  ]
};
```

Register it in `src/lib/lessons/index.js`:

```js
import loops from './loops.js';
export const lessons = [listLab, loops];
```

## Questions

Quiz answers use a zero-based option index. Give each question/reveal a unique id across its lesson so their states do not overlap.

```js
{
  type: 'quiz', id: 'total',
  question: 'What is the final value?',
  options: ['3', '6', '9'],
  answer: 1,
  explanation: 'The loop adds 1, 2, and 3.'
}
```

```js
{
  type: 'reveal', id: 'boundary',
  question: 'What if the condition uses < instead of <=?',
  answer: 'The final iteration is excluded.'
}
```

Blocks render strings as text, so code and student-facing wording are escaped automatically. They do not interpret HTML. Keep each slide to one central idea and use teacher notes for facilitation prompts.

## Interactive Svelte slides

For a new simulation, add a component under `src/lib/components/`. Use Svelte 5 `$state` and `$derived` for its local interaction state. Add a unique slide `kind`, then select the component in `Player.svelte` before the `slide.blocks` branch. The existing `kind: 'growth'` and `GrowthLab.svelte` show this pattern.

For multiple different simulations on adjacent slides, key components by the slide id or page number if their state should reset on navigation.

The existing List Lab also demonstrates a pure renderer/reducer contract for richer author-owned diagrams:

- `initialState()` returns a fresh activity object for one player.
- `render({page, ...activity})` returns trusted, authored HTML.
- `act(previous, dataset, input)` returns a new state without changing the old one.
- `data-step`, `data-reset`, and other diagram buttons dispatch through the player.
- `data-go` changes slides. `data-quiz` and `data-reveal` use the player's shared feedback state.

Do not pass untrusted HTML or uploaded content to the renderer. Prefer native Svelte blocks/components for new lessons. `list-lab.js` keeps the existing diagrams editable without coupling them to routing or global document handlers.

## Styling and checks

Edit the CSS variables at the beginning of `src/app.css` to change the palette across every lesson. Existing classes include `lede`, `grid`, `panel`, `stage`, `callout`, `question`, and `row`.

After editing, run `npm run check`, `npm test`, and `npm run build`. Preview the lesson at classroom/projector size and on a narrow screen. If you change interactions, add or update a browser test in `tests/browser/` and run `npm run test:e2e`.
