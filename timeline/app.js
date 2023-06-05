// Setup variables
const width = window.innerWidth - 20;
const height = window.innerHeight - 20;
const xStart = 110;
const xEnd = width - 110;
const yStart = 25;
const yEnd = 75;
const gap = -100; // Between the two timelines (you can change the signal)
const months = 6; // Months to be shown around the selected day

const startDate = new Date('1977-08-20');
const endDate = new Date('1989-10-02');

// Where to start the brush
let selectedDay = new Date('1980-08-20');
// We can't start id with a number
let prevSelectedId = 'day' + selectedDay.toLocaleDateString().replaceAll('/', '-');

// Create the svg
const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

// Create a the brushable timeline
const mainTimeline = svg.append("g").attr("id", "mainTimeline");

// Function to create the x scale
const xScaleTimeLine = (startTime, endTime) =>
        d3.scaleUtc()
        .domain([startTime, endTime])
        .range([xStart, xEnd]);

// Function to create the x axis
const xAxisTimeLine = (xScale) =>
        d3.axisBottom().scale(xScale)


// Create the x scale and axis for the main timeline
const xMainTimelineScale = xScaleTimeLine(startDate, endDate);
const xAxisMainTimeline = xAxisTimeLine(xMainTimelineScale);
const fullData = d3.timeDays(startDate, endDate);

// Calculate width of each day
const dayWidth = (xMainTimelineScale(d3.timeDay.offset(startDate, 1)) - xMainTimelineScale(startDate));

// Create a vertical line for each day
const datapoints = mainTimeline
      .selectAll("line")
      .data(fullData)
      .join("line")
      .attr("x1", (d) => xMainTimelineScale(d))
      .attr("x2", (d) => xMainTimelineScale(d))
      .attr("y1", yStart)
      .attr("y2", yEnd)
      .attr("stroke", "white")
      .attr("stroke-width", dayWidth)
      .attr("id", d => 'day' + d.toLocaleDateString().replaceAll('/', '-'))
      .on("mouseover", function(d) { // to use this

        let selection = d3.select(this);
        selectedDay = xMainTimelineScale.invert(selection.attr("x1"));

        // mainTimeline.selectAll("rect").remove();
        createBrush(selectedDay); // brush around the selected day
        hoverSelectedDay(selection.attr("id")); // handles the hover effect
      });

createBrush = (selectedDay) => {

    // calculate the first and last day to be selected
    // check if the first day is before the start date
    let firstSelectedDay = d3.timeMonth.offset(selectedDay, -months) < startDate
                         ? startDate : d3.timeMonth.offset(selectedDay, -months);
    // check if the last day is after the end date
    let lastSelectedDay = d3.timeMonth.offset(selectedDay, months) > endDate
                         ? endDate : d3.timeMonth.offset(selectedDay, months);

    // lock x axis to be within the range of the timeline
    let rectWidth = xMainTimelineScale(lastSelectedDay) - xMainTimelineScale(firstSelectedDay);

    // create the rectangle
    mainTimeline.selectAll("rect")
            .data([selectedDay])
            .join("rect")
            .attr("x", (d) => xMainTimelineScale(firstSelectedDay))
            .attr("y", yStart)
            .attr("width", rectWidth)
            .attr("height", yEnd - yStart)
            .attr("fill", "gray")
            .attr("opacity", 0.3)
            .attr("stroke", "white")
            .on("mouseover", d => mainTimeline.selectAll("rect").remove());

    // create the selected timeline
    createSelectedTimeline(selectedDay, firstSelectedDay, lastSelectedDay);
}

// Create the x axis for the main timeline
svg.append("g")
    .attr("id", "x-axis-time")
    .attr("transform", `translate(0, ${yEnd})`)
    .call(xAxisMainTimeline);

// Create the selected timeline
selectedTimeline = svg.append("g").attr("id", "selectedTimeline");

// Function to create the selected timeline
createSelectedTimeline = (hoveredDay, firstSelectedDay, lastSelectedDay) => {
    // Cleans a possible old selected timeline
    selectedTimeline.select("#x-axis-selected-time").remove();
    selectedTimeline.selectAll("line").remove();
    
    // Set some variables in order to handle the selected timeline
    let shift = d3.timeMonth.offset(hoveredDay, -months);
    let xSelectedTimelineScale = xScaleTimeLine(firstSelectedDay, lastSelectedDay);
    let xAxisSelectedTimeline = xAxisTimeLine(xSelectedTimelineScale);
    let selectedData = d3.timeDays(firstSelectedDay, lastSelectedDay);
    let selectedDayWidth = (xSelectedTimelineScale(d3.timeDay.offset(shift, 1)) - xSelectedTimelineScale(shift));

    // Create the vertical lines for the selected timeline
    selectedTimeline.selectAll("line")
        .data(selectedData)
        .join("line")
        .attr("x1", (d) => xSelectedTimelineScale(d))
        .attr("x2", (d) => xSelectedTimelineScale(d))
        .attr("y1", yStart - gap)
        .attr("y2", yEnd - gap)
        .attr("stroke", "white")
        .attr("stroke-width", selectedDayWidth)
        .attr("id", d => 'day' + d.toLocaleDateString().replaceAll('/', '-'))
        .on("mouseover", function(d) {
            let selection = d3.select(this);
            selectedDay = xSelectedTimelineScale.invert(selection.attr("x1"));
            hoverSelectedDay(selection.attr("id"));
          });
    
    // Create the x axis for the selected timeline
    selectedTimeline.append("g")
        .attr("id", "x-axis-selected-time")
        .attr("transform", `translate(0, ${yEnd - gap})`)
        .call(xAxisSelectedTimeline);
}


const hoverSelectedDay = (selectedId) => {
    // unhover the previous selected day
    mainTimeline.select(`#${prevSelectedId}`).attr("stroke", "white")
    // hover the selected day
    mainTimeline.select(`#${selectedId}`).attr("stroke", "red")
    
    // unhover the previous selected day
    selectedTimeline.select(`#${prevSelectedId}`).attr("stroke", "white")
    // hover the selected day
    selectedTimeline.select(`#${selectedId}`).attr("stroke", "red")

    // update the previously selected day
    prevSelectedId = selectedId;

    // console.log(selectedDay); // Verify the selected day
}

// Start the brush around the selected day
createBrush(selectedDay);
hoverSelectedDay(prevSelectedId);


