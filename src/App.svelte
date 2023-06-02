<script>
import HomePage from '@/pages/home/home.page.svelte';
import VizPage from '@/pages/viz/viz.page.svelte';
import { Route, Router } from 'svelte-routing';

export let url = '';
</script>

<Router {url}>
  <Route path="/"><HomePage /></Route>
  <Route path="/viz"><VizPage /></Route>
</Router>
