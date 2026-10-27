<script>
  let { blocks, answers, revealed, onAnswer, onReveal } = $props();
</script>
{#each blocks as block}
  {#if block.type === 'paragraph'}
    <p class="lede">{block.text}</p>
  {:else if block.type === 'code'}
    <pre class="content-section"><code>{block.text}</code></pre>
  {:else if block.type === 'callout'}
    <div class="callout">{#if block.title}<h2>{block.title}</h2>{/if}<p>{block.text}</p></div>
  {:else if block.type === 'quiz'}
    <div class="question"><p>{block.question}</p><div class="choices">
      {#each block.options as option, i}<button onclick={() => onAnswer(block.id, i === block.answer, block.explanation)}>{option}</button>{/each}
    </div><div class="feedback" aria-live="polite">{answers[block.id] || 'Choose an answer, then explain your evidence.'}</div></div>
  {:else if block.type === 'reveal'}
    <div class="question"><p>{block.question}</p><button aria-expanded={!!revealed[block.id]} onclick={() => onReveal(block.id)}>{revealed[block.id] ? 'Hide reasoning' : 'Reveal reasoning'}</button>
    {#if revealed[block.id]}<div class="answer">{block.answer}</div>{/if}</div>
  {/if}
{/each}
