<script lang="ts">
import { data } from '@/stores/data';
import { player } from '@/stores/player';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';
import { getPlanetCoords } from './planet-coords';

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

export let missionNumber = 1;

let width = 0;
let height = 0;
let scale = 50;
let center = { x: 0, y: 0 };

let solarSystem: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
let resizeObserver: ResizeObserver;

$: voyagerData = (
  missionNumber == 1 ? $data.voyager1DailyPosition : $data.voyager2DailyPosition
).map((d) => {
  const deg2rad = Math.PI / 180;

  const r = +d.range;
  const cosLat = Math.cos(+d.se_lat * deg2rad);
  const sinLon = Math.sin(+d.se_lon * deg2rad);
  const cosLon = Math.cos(+d.se_lon * deg2rad);

  return {
    date: dayjs(d.date).toDate(),
    x: r * cosLat * cosLon,
    y: r * cosLat * sinLon,
  };
});

onMount(() => {
  solarSystem = d3.select('#solar-system');

  resizeObserver = new ResizeObserver((entries) => {
    const { width: w, height: h } = entries[0].contentRect;
    width = w;
    height = h;
  });

  resizeObserver.observe(solarSystem.node()!);

  solarSystem.on('wheel', (event: WheelEvent) => {
    const oldScale = scale;
    const variation = 1 - event.deltaY / 1000;
    scale = oldScale * variation;

    const rect = (event.target as SVGImageElement).getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    center.x += +(1 - variation) * (x - width / 2 - center.x);
    center.y += +(1 - variation) * (y - height / 2 - center.y);
  });

  solarSystem.on('mousedown', (event: MouseEvent) => {
    let { clientX, clientY } = event;

    const mouseMove = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;

      center.x += x - clientX;
      center.y += y - clientY;

      clientX = x;
      clientY = y;
    };

    const mouseUp = () => {
      solarSystem.on('mousemove', null);
      solarSystem.on('mouseup', null);
    };

    solarSystem.on('mousemove', mouseMove);
    solarSystem.on('mouseup', mouseUp);
  });
});

onDestroy(() => {
  resizeObserver.disconnect();
});

$: if (solarSystem) {
  solarSystem.attr('width', width).attr('height', height);

  solarSystem
    .selectAll('image[data-name="sun"]')
    .attr('width', (4 * scale) / 10)
    .attr('height', (4 * scale) / 10)
    .attr('href', `/images/sun.png`)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('transform', function (d) {
      const rect = (this as SVGImageElement).getBoundingClientRect();
      const { width, height } = rect;

      return `translate(${-width / 2 + center.x}, ${-height / 2 + center.y})`;
    });

  const plantesWithCoords = planets.map((name) => ({
    name,
    ...getPlanetCoords(name, $player.date.getTime()),
  }));

  solarSystem
    .selectAll('image.planet')
    .data(plantesWithCoords, (d: { name: string }) => d.name)
    .join('image')
    .attr('width', (d) => ((d.name == 'saturn' ? 3 : 1) * scale) / 10)
    .attr('height', (d) => ((d.name == 'saturn' ? 3 : 1) * scale) / 10)
    .attr('href', (d) => `/images/${d.name}.png`)
    .attr('class', 'planet')
    .attr('data-name', (d) => d.name)
    .attr('x', (d) => width / 2 + d.x * scale)
    .attr('y', (d) => height / 2 + d.y * scale)
    .attr('transform', function (d) {
      const rect = (this as SVGImageElement).getBoundingClientRect();
      const { width, height } = rect;

      return `translate(${-width / 2 + center.x}, ${-height / 2 + center.y})`;
    });

  const voyagerCoord = voyagerData.find(
    (d) => d.date.getTime() === $player.date.getTime()
  );

  if (voyagerCoord) {
    d3.select('circle[data-name="voyager"]')
      .attr('r', scale / 50)
      .attr('fill', 'white')
      .attr('cx', width / 2 + voyagerCoord.x * scale)
      .attr('cy', height / 2 + voyagerCoord.y * scale)
      .attr('transform', function (d) {
        const rect = (this as SVGCircleElement).getBoundingClientRect();
        const { width, height } = rect;

        return `translate(${-width / 2 + center.x}, ${-height / 2 + center.y})`;
      });
  }
}
</script>

<svg id="solar-system">
  <image data-name="sun" />
  <circle data-name="voyager" />
</svg>

<style lang="scss">
svg {
  background-color: black;

  width: 100%;
  height: 100%;
}
</style>
