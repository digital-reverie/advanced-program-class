<script>import { page } from '$app/state';</script><div class="library"><h1>{page.status}</h1><p>{page.error?.message || 'Something went wrong.'}</p><a href="/">Return to lessons</a></div>
