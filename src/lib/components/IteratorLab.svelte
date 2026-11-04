<script>
  let empty = $state(false);
  let positions = $state([0,0]);
  let results = $state(['Ready.','Ready.']);
  const items = $derived(empty?[]:['red','blue','gold']);
  function reset(){positions=[0,0];results=['Ready.','Ready.'];}
  function call(cursor,operation){
    const pos=positions[cursor];
    if(operation==='hasNext') results[cursor]=`hasNext() → ${pos<items.length}. Position stays ${pos}.`;
    else if(pos>=items.length) results[cursor]='next() → NoSuchElementException. Position unchanged.';
    else {results[cursor]=`next() → ${items[pos]}. Position advances from ${pos} to ${pos+1}.`;positions[cursor]++;}
  }
</script>
<p class="lede">Both iterators refer to one collection, but each owns its position. Predict the result, then call a method. Repeating hasNext should never consume a value.</p>
<label class="row"><input type="checkbox" bind:checked={empty} onchange={reset}/> Use an empty collection</label>
<div class="stage"><h2>Shared collection · size = {items.length}</h2><div class="array">{#each items as item,i}<div class="cell"><div class="box used">{item}</div><div class="index">[{i}]</div></div>{:else}<p>No active items.</p>{/each}</div></div>
<div class="grid">{#each ['A','B'] as name,i}<section class="panel" aria-label={`Iterator ${name}`}><h2>Iterator {name}</h2><p class="tag" data-position>position = {positions[i]}</p><p>Next item: {items[positions[i]]??'end of traversal'}</p><div class="row"><button onclick={()=>call(i,'hasNext')}>{name}.hasNext()</button><button onclick={()=>call(i,'next')}>{name}.next()</button></div><p class="status" aria-live="polite">{results[i]}</p></section>{/each}</div>
<button onclick={reset}>Reset both cursors</button>
<div class="callout">A successful next reads the current item and advances once. Calling next at the end reports the exception even if you never called hasNext first. The collection itself is unchanged.</div>
<p class="small">This interactive model illustrates Java calls; it does not compile Java. No collection mutation occurs during traversal.</p>
