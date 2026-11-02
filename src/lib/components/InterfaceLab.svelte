<script>
  import { resolveCall, printWork } from '../lessons/interface-model.js';
  let { mode } = $props();
  let declared = $state('List61B');
  let actual = $state('SLList');
  let call = $state('print');
  let revealed = $state(false);
  let n = $state(8);
  const result = $derived(resolveCall(declared,actual,call));
  const work = $derived(printWork(n));
</script>
{#if mode === 'interface-dispatch'}
  <p class="lede">Change one choice at a time. Decide whether the code compiles before predicting which method runs.</p>
  <div class="row controls">
    <label>Declared type <select aria-label="Declared type" bind:value={declared} onchange={()=>revealed=false}><option>List61B</option><option>SLList</option><option>AList</option></select></label>
    <label>Created object <select aria-label="Created object" bind:value={actual} onchange={()=>revealed=false}><option>SLList</option><option>AList</option></select></label>
    <label>Call <select aria-label="Method call" bind:value={call} onchange={()=>revealed=false}><option value="print">x.print()</option><option value="capacity">x.capacity()</option><option value="label">WordTools.label(x)</option></select></label>
  </div>
  <pre class="content-section"><code>{`${declared}<String> x = new ${actual}<>();\n${call==='label'?'WordTools.label(x);':`x.${call}();`}`}</code></pre>
  <div class="grid content-section"><div class="panel"><h2>Reference declaration</h2><p><code>{declared}&lt;String&gt; x</code></p><p class="small">Used for compile-time assignment and method checks.</p></div><div class="panel"><h2>Requested object</h2><p><code>new {actual}&lt;&gt;()</code></p><p class="small">Supplies runtime instance behavior if the declaration and call compile.</p></div></div>
  <div class="question"><p>Your prediction: compile error, inherited default, concrete method, or overloaded helper?</p><button class="primary" onclick={()=>revealed=true}>Check prediction</button>
  {#if revealed}<div class="answer" aria-live="polite"><h2>{result.stage}</h2><p data-resolution>{result.result}</p><p>{result.reason}</p></div>{/if}</div>
  <p class="small">Assumptions: both classes implement List61B. SLList overrides print; AList inherits its default. Only AList declares capacity. WordTools overloads label for List61B and SLList. No casts are used. This lab models Java’s rules; it does not run a Java compiler.</p>
{:else}
  <p class="lede">A linked-list get(i) starts at the first item and inspects i + 1 item nodes. Repeating it for every index revisits the same nodes many times.</p>
  <label class="row">List size <input id="list-size" type="range" min="1" max="40" bind:value={n} /><output>{n} items</output></label>
  <div class="stage content-section"><div class="grid"><div><h2>Default print on SLList</h2><div class="metric" data-indexed>{work.indexed} node inspections</div><div class="bar" style:width="100%"></div><p>get(0) visits 1 node, get(1) visits 2, and so on through get({n-1}).</p></div><div><h2>One-pass SLList override</h2><div class="metric" data-direct>{work.direct} node inspections</div><div class="bar" style:width={`${100*work.direct/work.indexed}%`}></div><p>One cursor follows the links, visiting each item once.</p></div></div><p class="small">Bars share a scale. Count excludes the sentinel, printing cost, and loop bookkeeping. size() is assumed constant time.</p></div>
  <div class="callout"><h2>Why the default is fine for AList</h2><p>Each indexed get is a direct array access. The same loop needs {work.array} array-item reads. A reusable default can be correct for both lists and still benefit from a representation-specific override.</p></div>
  <p class="small">Linked indexed traversal: n(n + 1) / 2 item-node inspections, O(n²). One traversal: n item-node inspections, O(n).</p>
{/if}
<style>.controls{align-items:end}.controls label{display:grid;gap:7px;font-size:17px}.metric{font-size:clamp(25px,2.6vw,36px);overflow-wrap:anywhere}select{max-width:100%}</style>
