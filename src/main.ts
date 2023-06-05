import minMax from 'dayjs/plugin/minMax';
import App from './App.svelte';
import './main.scss';

import dayjs from 'dayjs';

dayjs.extend(minMax);

const app = new App({
  target: document.getElementById('app'),
});

export default app;
