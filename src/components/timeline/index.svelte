<script lang="ts">
import { player, resumePlayer } from '@/stores/player';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';

let width = 0;
let height = 0;

let timeline: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
let resizeObserver: ResizeObserver;

const padding = 15;
const months = 6;

const startDate = new Date('1977-08-20');
const endDate = new Date('1989-10-02');
let hoveredDate = null;

$: selectedDate = hoveredDate ?? $player.date;

$: mainTimelineScale = d3
  .scaleTime()
  .domain([startDate, endDate])
  .range([0, width - padding * 2]);
$: mainTimelineAxisScale = d3
  .axisBottom(mainTimelineScale)
  .scale(mainTimelineScale)
  .tickFormat(d3.timeFormat('%Y'));

$: firstSelectedDay = dayjs
  .max(dayjs(selectedDate).subtract(months, 'month'), dayjs(startDate))
  .toDate();
$: lastSelectedDay = dayjs
  .min(dayjs(selectedDate).add(months, 'month'), dayjs(endDate))
  .toDate();

$: selectedTimelineScale = d3
  .scaleTime()
  .domain([firstSelectedDay, lastSelectedDay])
  .range([0, width - padding * 2]);
$: selectedTimelineAxisScale = d3
  .axisBottom(selectedTimelineScale)
  .scale(selectedTimelineScale)
  .tickFormat(d3.timeFormat('%b %Y'));

onMount(() => {
  timeline = d3.select('#timeline');

  resizeObserver = new ResizeObserver((entries) => {
    const { width: w, height: h } = entries[0].contentRect;
    width = w;
    height = h;
  });

  resizeObserver.observe(timeline.node()!);

  timeline.select('#main-timeline').on('mousemove', function (event) {
    const [x, _] = d3.pointer(event, this);
    hoveredDate = mainTimelineScale.invert(x);
  });

  timeline.select('#main-timeline').on('mouseleave', function (event) {
    hoveredDate = null;
  });

  timeline.select('#main-timeline').on('click', function (event) {
    const [x, _] = d3.pointer(event, this);
    const date = mainTimelineScale.invert(x);

    resumePlayer({ date: dayjs(date).startOf('day').toDate() });
  });
});

onDestroy(() => {
  resizeObserver.disconnect();
});

$: if (timeline) {
  const mainTimeline = timeline.select('#main-timeline');
  const mainTimelineBrush = timeline.select('#main-timeline-brush');
  const mainTimelineAxis = timeline.select('#main-timeline-axis');
  const selectedTimeline = timeline.select('#selected-timeline');
  const selectedTimelineAxis = timeline.select('#selected-timeline-axis');

  const rectWidth =
    mainTimelineScale(lastSelectedDay) - mainTimelineScale(firstSelectedDay);

  mainTimeline
    .selectAll('line')
    .data([$player.date])
    .join('line')
    .attr('x1', (d) => mainTimelineScale(d))
    .attr('x2', (d) => mainTimelineScale(d))
    .attr('y1', 0)
    .attr('y2', 15)
    .attr('stroke', '#bd9526')
    .attr('stroke-width', 2);

  mainTimelineBrush
    .attr('x', () => mainTimelineScale(firstSelectedDay))
    .attr('width', rectWidth)
    .attr('fill', 'black')
    .attr('opacity', 0.3)
    .attr('stroke', 'white');

  mainTimelineAxis.call(mainTimelineAxisScale as any);

  selectedTimeline
    .selectAll('line')
    .data([$player.date])
    .join('line')
    .attr('x1', (d) => selectedTimelineScale(d))
    .attr('x2', (d) => selectedTimelineScale(d))
    .attr('y1', 0)
    .attr('y2', height - 80)
    .attr('stroke', '#bd9526')
    .attr('stroke-width', 2);

  selectedTimelineAxis.call(selectedTimelineAxisScale as any);
}
</script>

<svg id="timeline" width="100%" height="100%">
  <g
    id="main-timeline"
    width={width - padding * 2}
    height={15}
    transform="translate({padding}, 10)"
  >
    <rect width={width - padding * 2} height={15} fill="transparent" />
  </g>

  <rect id="main-timeline-brush" height={15} transform="translate({padding}, 10)" />

  <g id="main-timeline-axis" transform="translate({padding}, 25)" />

  <g
    id="selected-timeline"
    width={width - 20}
    height={height - 80}
    transform="translate({padding}, 50)"
  />
  <g id="selected-timeline-axis" transform="translate({padding}, 82)" />
</svg>

<style lang="scss">
#main-timeline-brush {
  pointer-events: none;
}

svg {
  width: 100%;
  height: 100%;

  background-color: #121212;
}
</style>
