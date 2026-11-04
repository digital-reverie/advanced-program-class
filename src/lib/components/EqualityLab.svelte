<script>
  const cases={alias:{label:'Alias: b = a',identity:true,values:['red','blue'],type:'ArraySet',reason:'Both references identify object #1.'},reordered:{label:'New set, same members',identity:false,values:['blue','red'],type:'ArraySet',reason:'Object #2 has the same size and members, despite a different storage order.'},different:{label:'New set, different member',identity:false,values:['red','gold'],type:'ArraySet',reason:'Sizes match, but blue is absent from b.'},subset:{label:'New set, fewer members',identity:false,values:['red'],type:'ArraySet',reason:'Sizes differ. One-way membership alone would not be enough.'},null:{label:'Null reference',identity:false,values:[],type:'null',reason:'instanceof rejects null before we inspect members.'},list:{label:'List with the same words',identity:false,values:['red','blue'],type:'List',reason:'Our teaching ArraySet only compares equal to another ArraySet.'}};
  let selected = $state('reordered');
  let visible = $state(false);
  const example = $derived(cases[selected]);
  const equal = $derived(example.identity || (example.type==='ArraySet' && example.values.length===2 && ['red','blue'].every(x=>example.values.includes(x))));
</script>
<p class="lede">a always refers to an ArraySet containing red and blue. Change b, predict identity and value equality, then reveal both answers.</p>
<label class="row">Comparison case <select aria-label="Comparison case" bind:value={selected} onchange={()=>visible=false}>{#each Object.entries(cases) as [key,value]}<option value={key}>{value.label}</option>{/each}</select></label>
<div class="grid"><section class="panel"><h2>a → object #1</h2><p>ArraySet</p><div class="row"><span class="tag">red</span><span class="tag">blue</span></div></section><section class="panel"><h2>b → {example.type==='null'?'null':example.identity?'object #1':'object #2'}</h2><p>{example.type}</p><div class="row">{#each example.values as item}<span class="tag">{item}</span>{/each}</div></section></div>
<pre><code>{'a == b         // Same object?\na.equals(b)    // Our ArraySet membership equality?'}</code></pre>
<button aria-expanded={visible} onclick={()=>visible=!visible}>{visible?'Hide results':'Check predictions'}</button>
{#if visible}<div class="answer" aria-live="polite"><p data-identity>a == b → {String(example.identity)}</p><p data-equality>a.equals(b) → {String(equal)}</p><p>{example.reason}</p></div>{/if}
<div class="callout">Without an equals override, Object.equals would give the identity result. Our override changes the meaning of equals; it does not change ==.</div>
