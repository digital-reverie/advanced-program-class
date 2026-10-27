<script>
  import { onMount, tick } from 'svelte';
  import { replaceState } from '$app/navigation';
  import Blocks from './Blocks.svelte';
  import GrowthLab from './GrowthLab.svelte';
  let { lesson } = $props();
  let page = $state(0);
  let notes = $state(false);
  let fullLabel = $state('Full screen');
  // The route keys this component by lesson id; a new lesson starts a fresh session.
  function createActivity() { return lesson.initialState?.() ?? { step: 0, quizAnswers: {}, revealed: {} }; }
  let activity = $state.raw(createActivity());
  let content;
  const slide = $derived(lesson.slides[page]);
  const markup = $derived(lesson.render?.({page, ...activity}) ?? '');

  function fromHash() {
    const n = Number(window.location.hash.slice(1));
    if (Number.isInteger(n) && n >= 1 && n <= lesson.slides.length) {
      page = n - 1;
      activity = { ...activity, step: 0 };
    }
  }
  onMount(() => {
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  });
  function go(n) {
    page = Math.max(0, Math.min(lesson.slides.length - 1, n));
    activity = { ...activity, step: 0 };
    replaceState(`#${page + 1}`, {});
    window.scrollTo(0, 0);
  }
  function answer(id, correct, explanation) {
    activity = { ...activity, quizAnswers: { ...activity.quizAnswers, [id]: correct ? `Correct. ${explanation}` : 'Try again. Trace the fields or indices before choosing.' } };
  }
  function reveal(id) {
    activity = { ...activity, revealed: { ...activity.revealed, [id]: !activity.revealed[id] } };
  }
  function keydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest('input,select,textarea,button,a,[contenteditable]')) return;
    if (event.key === 'ArrowRight') {event.preventDefault();go(page + 1);}
    if (event.key === 'ArrowLeft') {event.preventDefault();go(page - 1);}
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { fullLabel = 'Use browser full screen (F11)'; }
  }
  // The existing diagram lesson produces trusted, author-owned markup. Its
  // buttons dispatch state updates here; it has no document/global side effects.
  async function action(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button');
    if (!button || !content?.contains(button) || !lesson.render || button.disabled) return;
    const data = { ...button.dataset };
    if (!Object.keys(data).length) return;
    const input = content.querySelector('#item')?.value;
    const selector = Object.entries(data).map(([k,v]) => `[data-${k}="${CSS.escape(v)}"]`).join('');
    if (data.go !== undefined) {go(Number(data.go));return;}
    if (data.reveal) reveal(data.reveal);
    else if (data.quiz) answer(data.quiz, data.choice === data.right, data.why);
    else if (lesson.act) activity = lesson.act(activity, data, input);
    await tick();
    if (selector) content.querySelector(selector)?.focus({preventScroll:true});
  }
  function input(event) {
    if (!(event.target instanceof HTMLInputElement) || !content?.contains(event.target)) return;
    if (event.target.id === 'growth') activity = { ...activity, growthN: Number(event.target.value) };
  }
</script>

<svelte:head><title>{lesson.title} · Classroom Lab</title><meta name="description" content={lesson.description} /></svelte:head>
<svelte:window onkeydown={keydown} onclick={action} oninput={input} />
<header><a class="brand-link" href="/">CLASSROOM LAB</a><span>{lesson.subject}</span><span class="spacer"></span><button id="notes-toggle" aria-pressed={notes} onclick={() => notes = !notes}>Teacher notes</button><button id="full" onclick={fullscreen}>{fullLabel}</button></header>
<main id="slide">
  <div class="eyebrow">{slide.section}</div><h1>{slide.title}</h1>
  <div bind:this={content} data-slide-content>
    {#if slide.kind === 'growth'}
      <GrowthLab />
    {:else if slide.blocks}
      <Blocks blocks={slide.blocks} answers={activity.quizAnswers} revealed={activity.revealed} onAnswer={answer} onReveal={reveal} />
    {:else}
      {@html markup}
    {/if}
  </div>
  {#if notes}<aside class="notes"><b>Teacher notes · visible to the class when open</b><p>{slide.notes}</p>{#if slide.source}<p>Reference: {slide.source}</p>{/if}</aside>{/if}
</main>
<footer>
  <button id="prev" disabled={page === 0} onclick={() => go(page - 1)}>← Back</button>
  <label><span class="hidden">Choose slide</span><select id="jump" aria-label="Choose slide" value={page} onchange={event => go(Number(event.currentTarget.value))}>{#each lesson.slides as item, i}<option value={i}>{String(i+1).padStart(2,'0')} · {item.title}</option>{/each}</select></label>
  <span id="counter">{page + 1} / {lesson.slides.length}</span><div class="track"><div class="fill" id="progress" style:width={`${100*(page+1)/lesson.slides.length}%`}></div></div>
  <button id="next" class="primary" disabled={page === lesson.slides.length - 1} onclick={() => go(page + 1)}>Next →</button>
</footer>
