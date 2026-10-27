<script>import { lessons } from '../lib/lessons/index.js';</script>
<svelte:head><title>Classroom Lab</title><meta name="description" content="Interactive lessons for the classroom" /></svelte:head>
<div class="library"><div class="eyebrow">Classroom Lab</div><h1>Lessons worth exploring</h1><p class="lede">Predict, step through, and explain. Choose a lesson to begin.</p>
<div class="library-grid">{#each lessons as lesson}<a class="panel lesson-card" href="/lessons/{lesson.id}"><div class="eyebrow">{lesson.subject}</div><h2>{lesson.title}</h2><p>{lesson.description}</p><span class="small">{lesson.slides.length} slides · Open lesson →</span></a>{/each}</div></div>
