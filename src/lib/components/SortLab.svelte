<script>
  import { cases, runCase, sortFrames, swapFrames } from '../lessons/sort-model.js';
  let { mode } = $props();
  let variant = $state('noop');
  let selected = $state(['sorted']);
  let results = $state(null);
  let preset = $state('mixed');
  let repaired = $state(false);
  let step = $state(0);
  const frames = $derived(mode === 'swap-trace' ? swapFrames(repaired) : sortFrames(cases.find(c=>c.id===preset).input));
  const frame = $derived(frames[Math.min(step,frames.length-1)]);
  const lines = $derived(mode === 'swap-trace'
    ? (repaired ? ['String temp = x[0];','x[0] = x[1];','x[1] = temp;'] : ['x[0] = x[1];','x[1] = x[0];'])
    : ['// Enter sort(x, start)','if (start >= x.length) return;','int best = findSmallest(x, start);','swap(x, start, best);','sort(x, start + 1);']);
  function toggle(id) {selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];results=null;}
</script>

{#if mode === 'test-suite'}
  <p class="lede">Choose an implementation and tests. Predict which cases will expose a bug, then run them. A green result is only as useful as the cases you selected.</p>
  <div class="row"><label>Implementation <select aria-label="Implementation" bind:value={variant} onchange={()=>results=null}><option value="noop">Do nothing</option><option value="one-pass">Only the first pass</option><option value="correct">Complete selection sort</option></select></label></div>
  <div class="stage"><h2>Test cases</h2><div class="row">{#each cases as c}<button aria-pressed={selected.includes(c.id)} onclick={()=>toggle(c.id)}>{c.label}</button>{/each}</div><p class="small">Each expected result was specified independently of the implementation.</p><button class="primary" disabled={!selected.length} onclick={()=>results=cases.filter(c=>selected.includes(c.id)).map(c=>runCase(c,variant))}>Run selected tests</button>
  {#if results}<p class="status" aria-live="polite">{results.filter(r=>r.pass).length} / {results.length} passed</p><div class="tablewrap"><table><thead><tr><th>Case</th><th>Input</th><th>Expected</th><th>Actual</th><th>Result</th></tr></thead><tbody>{#each results as r}<tr><td>{r.label}</td><td>[{r.input.join(', ')}]</td><td>[{r.expected.join(', ')}]</td><td>[{r.actual.join(', ')}]</td><td>{r.pass?'PASS':`FAIL at index ${r.mismatch}`}</td></tr>{/each}</tbody></table></div>{/if}</div>
  <div class="callout">Try the reverse-order case against “Only the first pass.” What work is still missing after the first swap?</div>
{:else}
  <p class="lede">{mode==='swap-trace'?'A correct swap must preserve both original items. Follow the assignments in order: each line reads the current array state.':'The boundary start separates fixed positions from the remaining suffix. Scan that suffix, swap its minimum into start, and advance.'}</p>
  <div class="row">
    {#if mode==='swap-trace'}
      <button aria-pressed={!repaired} onclick={()=>{repaired=false;step=0;}}>Broken swap</button><button aria-pressed={repaired} onclick={()=>{repaired=true;step=0;}}>Repaired swap</button>
    {:else}
      <label>Input <select aria-label="Trace input" bind:value={preset} onchange={()=>step=0}>{#each cases as c}<option value={c.id}>{c.label}</option>{/each}</select></label>
    {/if}
  </div>
  <div class="grid content-section"><div class="stage">
    <div class="row">{#if mode==='swap-trace'}<span class="tag">temp = {frame.temp}</span>{:else}<span class="tag">start = {frame.start}</span><span class="tag">smallestIndex = {frame.min<0?'—':frame.min}</span>{/if}</div>
    <div class="array" aria-label="Current array">{#each frame.a as value,i}<div class="cell word-cell"><div class:changed={mode!=='swap-trace' && (i===frame.scan || i===frame.min)} class:used={mode==='swap-trace' || i<frame.start} class="box">{value}</div><div class="index">[{i}]</div>{#if mode!=='swap-trace'}<div class="small">{i<frame.start?'fixed':i===frame.scan?'scan':i===frame.min?'best':''}</div>{/if}</div>{/each}</div>
    {#if !frame.a.length}<p>Empty array: no item indices exist.</p>{/if}
    <p class="status" aria-live="polite">{frame.message}</p>
    {#if mode!=='swap-trace'}<p class="small">Filled slots labeled “fixed” are outside the next search. Gold marks the current scan or best candidate.</p>{/if}
  </div><div><pre><code>{#each lines as line,i}<span class:active={i===frame.line}>{line}</span>{'\n'}{/each}</code></pre><div class="steps"><button disabled={step===0} onclick={()=>step--}>Previous step</button><button class="primary" disabled={step===frames.length-1} onclick={()=>step++}>Next step</button><button onclick={()=>step=0}>Reset trace</button><span>Step {step} of {frames.length-1}</span></div></div></div>
{/if}
<p class="small">Interactive model of the shown operations. This activity does not compile or execute Java or JUnit.</p>
<style>.word-cell{width:90px}.stage{margin-top:0}.word-cell .small{min-height:24px}</style>
