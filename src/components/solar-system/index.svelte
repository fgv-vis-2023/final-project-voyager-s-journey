<script lang="ts">
import { basePath } from '@/env';
import { data } from '@/stores/data';
import { player } from '@/stores/player';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';
import { getPlanetCoords, planets } from './planet-coords';

export let missionNumber : 1 | 2;

let width = 0;
let height = 0;
let scale = 50;
let center = { x: 0, y: 0 };
let followVoyager = false;

let solarSystem: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
let resizeObserver: ResizeObserver;

const voyagerData = $data.voyagerDailyPosition[missionNumber].map(
  (d) => {
    const deg2rad = Math.PI / 180;

    const r = +d.range;
    const cosLat = Math.cos(+d.se_lat * deg2rad);
    const sinLon = Math.sin(+d.se_lon * deg2rad);
    const cosLon = Math.cos(+d.se_lon * deg2rad);

    return {
      date: dayjs(d.date).format('YYYY-MM-DD'),
      x: r * cosLat * cosLon,
      y: r * cosLat * sinLon,
    };
  }
);

$: playerDate = dayjs($player.date).format('YYYY-MM-DD');

$: voyagerCoord = voyagerData.find((d) => d.date == playerDate);
$: voyagerTrajectory = voyagerData
  .filter((d) => d.date <= playerDate)
  .slice(-200);

$: computedCenter = followVoyager
  ? { x: -voyagerCoord.x * scale, y: -voyagerCoord.y * scale }
  : center;

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

    center.x += (1 - variation) * (x - width / 2 - center.x);
    center.y += (1 - variation) * (y - height / 2 - center.y);
  });

  solarSystem.on('mousedown', (event: MouseEvent) => {
    let { clientX, clientY } = event;

    const mouseMove = (event: MouseEvent) => {
      center = computedCenter;
      followVoyager = false;

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
    .select('image[data-name="sun"]')
    .attr('width', (5 * scale) / 10)
    .attr('height', (5 * scale) / 10)
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('transform', function (d) {
      const rect = (this as SVGImageElement).getBoundingClientRect();
      const { width, height } = rect;

      return `translate(${
        -width / 2 + computedCenter.x
      }, ${-height / 2 + computedCenter.y})`;
    });

  const plantesWithCoords = planets.map((name) => ({
    name,
    ...getPlanetCoords(name, $player.date.getTime()),
  }));

  solarSystem
    .selectAll('g.planet')
    .data(plantesWithCoords, (d: any) => d.name)
    .join(
      (enter) => {
        const g = enter.append('g').attr('class', 'planet');

        g.append('circle')
          .attr('fill', '#fff1')
          .attr('stroke', '#fff8')
          .attr('stroke-width', 1)
          .style('stroke-dasharray', 4);

        g.append('image')
          .attr('href', (d) => `${basePath}/images/${d.name}.png`)
          .attr('class', 'planet')
          .attr('data-name', (d) => d.name);

        return g;
      },
      (update) => {
        update.attr('transform', (d) => {
          const tx = width / 2 + d.x * scale + computedCenter.x;
          const ty = height / 2 + d.y * scale + computedCenter.y;

          return `translate(${tx}, ${ty})`;
        });

        update.select('circle').attr('r', (d) => scale / 6);

        update
          .select('image')
          .attr('width', (d) => ((d.name == 'saturn' ? 3 : 2) * scale) / 10)
          .attr('height', (d) => ((d.name == 'saturn' ? 3 : 2) * scale) / 10)
          .attr('transform', function (_d) {
            const rect = (this as SVGImageElement).getBoundingClientRect();
            const tx = -rect.width / 2;
            const ty = -rect.height / 2;

            return `translate(${tx}, ${ty})`;
          });

        return update;
      }
    );

  if (voyagerCoord) {
    d3.select('image[data-name="voyager"]')
      .attr('width', scale / 10)
      .attr('height', scale / 10)
      .attr('x', width / 2 + voyagerCoord.x * scale + computedCenter.x)
      .attr('y', height / 2 + voyagerCoord.y * scale + computedCenter.y)
      .attr('transform', function (d) {
        const rect = (this as SVGImageElement).getBoundingClientRect();
        const tx = -rect.width / 2;
        const ty = -rect.height / 2;

        return `translate(${tx}, ${ty})`;
      });
  }

  if ((voyagerTrajectory?.length ?? 0) > 0) {
    const line = d3
      .line<(typeof voyagerTrajectory)[0]>()
      .x((d) => width / 2 + d.x * scale + computedCenter.x)
      .y((d) => height / 2 + d.y * scale + computedCenter.y)
      .curve(d3.curveBundle);

    d3.select('path[data-name="voyager-trajectory"]')
      .attr('d', line(voyagerTrajectory))
      .attr('stroke-dasharray', 4)
      .attr('fill', 'none');
  }
}
</script>

<svg id="solar-system">
  <image data-name="sun" href="{basePath}/images/sun.png" />
  <image data-name="voyager" href="{basePath}/images/voyager.png" />
  <path data-name="voyager-trajectory" stroke="white" stroke-width="1" />
</svg>

<button class="follow-voyager-button" on:click={() => (followVoyager = true)}>
  Follow Voyager
</button>

<style lang="scss">
svg {
  background-color: black;

  width: 100%;
  height: 100%;

  user-select: none;
}

.follow-voyager-button {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: fit-content;

  background-color: transparent;
  color: white;
  border-color: white;
  padding: 0.5rem 0.75rem;

  &:hover {
    background-color: white;
    color: black;
  }
}
</style>
