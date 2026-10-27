<script>
import Player from '../../../lib/components/Player.svelte';
import { findLesson } from '../../../lib/lessons/index.js';
let { data } = $props();
</script>
{#key data.slug}<Player lesson={findLesson(data.slug)} />{/key}
