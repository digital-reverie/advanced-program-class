<script>
  let items = $state(['A','B','C','D','E']);
  let selected = $state(1);
  let phase = $state(0);
  let sampled = $state(false);
  let removed = $state('');
  let moved = $state('');
  function reset(){items=['A','B','C','D','E'];selected=1;phase=0;sampled=false;removed='';moved='';}
  function advance(){
    if(phase===0){removed=items[selected];moved=items[items.length-1];phase=1;}
    else if(phase===1){items[selected]=items[items.length-1];phase=2;}
    else if(phase===2){items=items.slice(0,-1);phase=3;}
  }
</script>
<p class="lede">A bag promises which items it holds, but not their order. Choose the index that a random generator might select, then predict how removal can avoid shifting every later item.</p>
<div class="stage">
  <label>Selected index <select aria-label="Selected index" disabled={phase>0} bind:value={selected} onchange={()=>sampled=false}>{#each items as item,i}<option value={i}>{i} ({item})</option>{/each}</select></label>
  <div class="array" data-bag>{#each items as item,i}<div class="cell"><div class="box used" class:changed={i===selected}>{item}</div><div class="index">[{i}]</div></div>{/each}</div>
  <p class="status" aria-live="polite">{#if phase===0}{sampled?`Sample returns ${items[selected]}; the bag is unchanged.`:'Predict the returned item and final array before stepping.'}{:else if phase===1}Save {removed} as the return value. Size is still {items.length}.{:else if phase===2}Overwrite slot {selected} with the last item, {moved}. This temporary state still includes the old last slot.{:else}Discard the last slot and return {removed}. Size is now {items.length}. The bag kept every other occurrence.{/if}</p>
  <div class="row"><button disabled={phase>0} onclick={()=>sampled=true}>Sample without removing</button><button disabled={phase===3} onclick={advance}>Next removal step</button><button onclick={reset}>Reset bag</button></div>
</div>
<pre><code>{`// Nonempty dense-array bag; i is a valid chosen index.
T result = items[i];
items[i] = items[size - 1];
items[size - 1] = null; // Release the unused reference.
size -= 1;
return result;`}</code></pre>
<div class="callout">Fixed number of array accesses: O(1) removal without shrinking. Sampling is O(1) and leaves size unchanged. Choosing the last index also works: its value is saved before that slot is cleared.</div>
<p class="small">This model uses a chosen index for repeatability. A real random bag chooses uniformly among occupied indices. The diagram hides unused capacity after removal; the code clears a slot rather than allocating a smaller array on every removal.</p>
