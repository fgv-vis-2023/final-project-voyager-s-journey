<script lang="ts">
import { data } from '@/stores/data';
import { player, resumePlayer } from '@/stores/player';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';

export let missionNumber: 1 | 2;

let width = 0;
let height = 0;

let timeline: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
let resizeObserver: ResizeObserver;

const padding = 15;
const months = 6;

const phases = $data.voyagerPhases[missionNumber];
const dates = $data.voyagerDailyPosition[missionNumber].map((d) =>
  dayjs(d.date)
);

console.log(phases);

const startDate = dayjs.min(dates)?.toDate();
const endDate = dayjs.max(dates)?.toDate();
let hoveredDate = null;

$: selectedDate = hoveredDate ?? $player.date;

const timelineColorScale = d3
  .scaleOrdinal()
  .domain(phases.map((d) => d.type))
  .range(["#11009E", "#4942E4"]);

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
    .selectAll('rect')
    .data(phases)
    .join('rect')
    .attr('x', (d) => mainTimelineScale(dayjs(d.start_time).toDate()))
    .attr('y', 0)
    .attr(
      'width',
      (d) =>
        mainTimelineScale(dayjs(d.end_time || endDate).toDate()) -
        mainTimelineScale(dayjs(d.start_time).toDate())
    )
    .attr('height', 15)
    .attr('fill', (d) => timelineColorScale(d.type) as string)
    .attr('opacity', 1);

  mainTimeline
    .selectAll('line')
    .data([$player.date])
    .join('line')
    .attr('x1', (d) => mainTimelineScale(d))
    .attr('x2', (d) => mainTimelineScale(d))
    .attr('y1', 0)
    .attr('y2', 15)
    .attr('stroke', 'white')
    .attr('stroke-width', 2);

  mainTimelineBrush
    .attr('x', () => mainTimelineScale(firstSelectedDay))
    .attr('width', rectWidth)
    .attr('fill', 'black')
    .attr('opacity', 0.3)
    .attr('stroke', 'white');

  mainTimelineAxis.call(mainTimelineAxisScale as any);

  selectedTimeline
    .selectAll('rect.phase')
    .data(phases)
    .join('rect')
    .attr('class', 'phase')
    .attr('x', (d) => selectedTimelineScale(dayjs(d.start_time).toDate()))
    .attr('y', 0)
    .attr(
      'width',
      (d) =>
        selectedTimelineScale(dayjs(d.end_time || endDate).toDate()) -
        selectedTimelineScale(dayjs(d.start_time).toDate())
    )
    .attr('height', height - 80)
    .attr('fill', (d) => timelineColorScale(d.type) as string)
    .attr('opacity', 1);

  selectedTimeline
    .selectAll('text.phase')
    .data(phases)
    .join('text')
    .attr('class', 'phase')
    .text((d) => d.name)
    .attr('fill', 'white')
    .attr('font-size', 16)
    .attr('font-weight', 'bold')
    .attr('x', function (d) {
      const x = selectedTimelineScale(dayjs(d.start_time).toDate());
      const rectWidth =
        selectedTimelineScale(dayjs(d.end_time || endDate).toDate()) - x;
      const textWidth = (this as SVGTextElement).getComputedTextLength();

      if (x < 0 && textWidth + 15 < rectWidth + x) {
        return 5;
      } else if (x < 0 && textWidth + 15 > rectWidth + x) {
        return rectWidth + x - textWidth - 10;
      }

      return x + 5;
    })
    .attr('y', 15);

  selectedTimeline
    .selectAll('rect.overflow')
    .data([0, 1])
    .join('rect')
    .attr('class', 'overflow')
    .attr('x', (d) => (d === 0 ? 0 : width) - padding * 2)
    .attr('y', 0)
    .attr('width', padding * 2)
    .attr('height', height - 80)
    .attr('fill', '#121212')
    .attr('opacity', 1);

  selectedTimeline
    .selectAll('line')
    .data([$player.date])
    .join('line')
    .attr('x1', (d) => selectedTimelineScale(d))
    .attr('x2', (d) => selectedTimelineScale(d))
    .attr('y1', 0)
    .attr('y2', height - 80)
    .attr('stroke', 'white')
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

  <rect
    id="main-timeline-brush"
    height={15}
    transform="translate({padding}, 10)"
  />

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
