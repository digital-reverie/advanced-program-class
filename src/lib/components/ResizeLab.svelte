<script>
  let step = $state(0);
  let reveal = $state(false);
  const old = ['C','D','E','F','G','H','A','B'];
  const logical = ['A','B','C','D','E','F','G','H'];
  const messages = ['Full: size = 8, capacity = 8, front = 6. Predict where A will go.',
    'Allocate 16 slots. Keep the old front and capacity while copying.',
    ...logical.map((v,i)=>`Copy logical item ${i}: old[${(6+i)%8}] → bigger[${i}] (${v}).`),
    'Redirect items to bigger and set front = 0. Size stays 8.',
    'Append Z at (front + size) % 16 = 8. Increase size to 9.'];
  let copied = $derived(Math.min(8, Math.max(0,step-1)));
  let bigger = $derived(Array.from({length:16},(_,i)=>i<copied?logical[i]:i===8 && step===11?'Z':'—'));
</script>
<p class="lede">The physical array wraps, but the logical list is A through H. A resize must preserve that sequence. Copy into consecutive slots, then reset front before appending Z.</p>
<div class="stage">
  <div class="row"><span class="tag">size = {step===11?9:8}</span><span class="tag">front = {step>=10?0:6}</span><span class="tag">capacity = {step>=10?16:8}</span></div>
  <h2>{step>=10?'Old storage (no longer items)':'items → old storage'}</h2>
  <div class="array">{#each old as value,i}<div class="cell"><div class:changed={step>=2 && step<=9 && i===(6+step-2)%8} class="box used">{value}</div><div class="index">[{i}]</div></div>{/each}</div>
  {#if step>=1}<h2>{step>=10?'items → new storage':'bigger → new storage'}</h2><div class="array" data-resized>{#each bigger as value,i}<div class="cell"><div class="box" class:used={value!=='—'}>{value}</div><div class="index">[{i}]</div></div>{/each}</div>{/if}
  <p class="status" aria-live="polite">{messages[step]}</p>
  <div class="row"><button disabled={step===0} onclick={()=>step--}>Previous step</button><button disabled={step===11} onclick={()=>step++}>Next step</button><button onclick={()=>{step=0;reveal=false;}}>Reset trace</button></div>
</div>
<pre><code>{`// Integer-item example; check capacity before adding.
int[] bigger = new int[items.length * 2];
for (int i = 0; i < size; i++) {
    bigger[i] = items[(front + i) % items.length];
}
items = bigger;
front = 0;
items[(front + size) % items.length] = x;
size += 1;`}</code></pre>
<div class="callout">The copy loop runs once per existing item: O(n) time. Each source-index calculation is O(1). The larger array requires O(n) extra space. Resetting front and appending after copying are O(1).</div>
<div class="question"><p>Why would copying old[0], old[1], … into new slots 0, 1, … and setting front = 0 be wrong?</p><button aria-expanded={reveal} onclick={()=>reveal=!reveal}>{reveal?'Hide reasoning':'Reveal reasoning'}</button>{#if reveal}<div class="answer">It produces C, D, E, F, G, H, A, B instead of A, B, C, D, E, F, G, H. Physical order and logical order differ. Keeping front = 6 also fails with the new capacity: wrapping now happens at 16, not 8.</div>{/if}</div>
