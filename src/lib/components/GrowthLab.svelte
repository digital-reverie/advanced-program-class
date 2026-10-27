<script>
  let n = $state(16);
  let open = $state(false);
  let comparison = $derived.by(() => {
    let copies = 0, capacity = 1;
    for (let size = 0; size < n; size++) if (size === capacity) {copies += size;capacity *= 2;}
    return {plus: n * (n - 1) / 2, copies, capacity};
  });
</script>
<p class="lede">Growing by one fills the new array immediately, so the next append copies everything again. Doubling leaves spare slots for later appends. Compare how many existing items each strategy copies.</p>
<label class="row">Number of appends <input type="range" id="growth" min="2" max="64" bind:value={n} /><output id="growth-n">{n}</output></label>
<div class="stage" id="growth-result"><div class="grid"><div><h2>Grow by 1</h2><div class="metric">{comparison.plus} copies</div><div class="bar" style:width="100%"></div><span class="small">Final capacity: {n}</span></div><div><h2>Double</h2><div class="metric">{comparison.copies} copies</div><div class="bar" style:width={`${100*comparison.copies/Math.max(comparison.plus,1)}%`}></div><span class="small">Final capacity: {comparison.capacity}</span></div></div><p class="small">Same bar scale. Both start empty with capacity 1. New-item writes are excluded.</p></div>
<div class="question"><p>If a resize copies n items, how can addLast still be amortized O(1)?</p><button aria-expanded={open} onclick={() => open = !open}>{open ? 'Hide reasoning' : 'Reveal reasoning'}</button>{#if open}<div class="answer">Doubling leaves room for many cheap appends. Across m appends from empty, the total old-item copies are less than 2m. A single resizing append still costs O(n).</div>{/if}</div>
<p class="small">Amortized cost averages the total work over a sequence of operations. It does not promise that every individual append is equally fast. A shrinking policy should leave spare space to avoid repeated grow/shrink cycles.</p>
