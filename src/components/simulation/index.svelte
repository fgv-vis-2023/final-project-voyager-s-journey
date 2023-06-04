<script lang="ts">
import { onMount } from 'svelte';
import * as d3 from 'd3';
import { getPlanetCoords } from './planet-coords';
import { player, resumePlayer } from '@/stores/player';

const planets = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
] as const;

let width: number = 0;
let height: number = 0;
let scale: number = 50;

onMount(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    const { width: w, height: h } = entries[0].contentRect;
    width = w;
    height = h;
  });

  resizeObserver.observe(document.querySelector('#simulation'));
  resumePlayer();
});

$: {
  const simulation = d3.select('#simulation');

  simulation.attr('width', width).attr('height', height);

  simulation
    .selectAll('image[data-name="sun"]')
    .attr('width', (4 * scale) / 10)
    .attr('height', (4 * scale) / 10)
    .attr('href', `/images/sun.png`)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('transform', function (d) {
      const rect = (this as SVGImageElement).getBoundingClientRect();
      const { width, height } = rect;

      return `translate(${-width / 2}, ${-height / 2})`;
    });

  const plantesWithCoords = planets.map((name) => ({
    name,
    ...getPlanetCoords(name, $player.date.getTime()),
  }));

  simulation
    .selectAll('image.planet')
    .data(plantesWithCoords, (d: { name: string }) => d.name)
    .join('image')
    .attr('width', (d) => ((d.name == 'saturn' ? 3 : 1) * scale) / 10)
    .attr('height', (d) => ((d.name == 'saturn' ? 3 : 1) * scale) / 10)
    .attr('href', (d) => `/images/${d.name}.png`)
    .attr('class', 'planet')
    .attr('data-name', (d) => d.name)
    .attr('x', (d, i) => width / 2 + d.x * scale)
    .attr('y', (d, i) => height / 2 + d.y * scale)
    .attr('transform', function (d) {
      const rect = (this as SVGImageElement).getBoundingClientRect();
      const { width, height } = rect;

      return `translate(${-width / 2}, ${-height / 2})`;
    });
}

function onMouseWheel(event: WheelEvent) {
  scale *= 1 - event.deltaY / 1000;
}
</script>

<svg id="simulation" on:wheel={onMouseWheel}>
  <image data-name="sun" />
</svg>

<style lang="scss">
svg {
  background-color: black;

  width: 100%;
  height: 100%;
}
</style>
