<script>
import HomePage from '@/pages/home';
import VizPage from '@/pages/viz';
import { Route, Router } from 'svelte-routing';

export let url = '';
</script>

<Router {url}>
  <Route path="/"><HomePage /></Route>
  <Route path="/viz"><VizPage /></Route>
</Router>
