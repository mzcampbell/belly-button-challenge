function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
  
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // Create the buildCharts function.
  function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
      console.log(data);
      // Create a variable that holds the samples array. 
      var samples = data.samples;
      // Create a variable that filters the samples for the object with the desired sample number.
      var resultsArray = samples.filter(obj => obj.id == sample);
      // Create a variable that holds the first sample in the array.
      var result = resultsArray[0];
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIDs = result.otu_ids;
      var otuLabs = result.otu_labels;
      var sampleVals = result.sample_values; 
      // Create a variable that filters the metadata array 
      var metadata = data.metadata;
      var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
      // Create a variable that holds the first sample in the metadata array
      var metaResult = metadataArray[0];
      // Create a variable that holds the washing frequency
      var washingFreq = parseInt(metaResult.wfreq);
  
      
    
    
      // Create the yticks for the bar chart.
      var yticks = otuIDs.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
      var xticks = sampleVals.slice(0,10).reverse();
      var labels = otuLabs.slice(0,10).reverse();
  
      // Create the trace for the bar chart. 
      var barData = {
        x: xticks,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels
      };
      // Create the layout for the bar chart. 
      var barLayout = {
       title: "Top 10 Bacteria Cultures Found",
      };
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", [barData], barLayout);
  
      // Create the trace for the bubble chart.
      var bubbleData = {
        x: otuIDs,
        y: sampleVals,
        text: otuLabs,
        mode: 'markers',
        marker: {
          size: sampleVals,
          color: otuIDs,
          
        },
      };
      
      // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        showlegend: false,
        height: 480,
        width: 1100,
        hovermode: "closest",
        paper_bgcolor: "lightblue"
      };

      
      // Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", [bubbleData], bubbleLayout);   
  
  
      // Gauge chart
      var gaugeData = {
        value: washingFreq,
        title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,10]},
          steps: [
            {range: [0,2], color:"red"},
            {range: [2,4], color:"darkorange"},
            {range: [4,6], color:"#ee9c00"},
            {range: [6,8], color:"#eecc00"},
            {range: [8,10], color:"#d4ee00"}
          ]
        }
      };
  
      var gaugeLayout = {
        width: 400, 
        height: 450, 
        margin: {t: 100, r: 100, l:100, b: 100},
        line: {
        color: "600000"
        },
        paper_bgcolor: "pink"
      };
  
      Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  
    });
};