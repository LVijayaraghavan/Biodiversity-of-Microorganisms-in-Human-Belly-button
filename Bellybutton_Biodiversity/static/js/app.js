function buildMetadata(sample) {

  

  // Use `d3.json` to fetch the metadata for a sample
  metaselect= d3.select("#sample-metadata")
  d3.json(`/metadata/${sample}`).then((data) => {
    d3.selectAll("span").remove();
    d3.selectAll("br").remove();
    Object.entries(data).forEach(([key, value]) => 
    {
      if (key !== 'WFREQ')   
      {  
    // console.log(`Key: ${key} and Value ${value}`);
    metaselect.append('span').text(`${key} : ${value}`).classed('fontstyle',true);
    metaselect.append("br")
      }
    });
    });
      
}

function buildCharts(sample) {
  

  //  Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((input) => {
    //  console.log(input);
     data=input.sort(function(x, y)
              {
            return  parseFloat(y.sample_values) - parseFloat(x.sample_values);
        });
     console.log(data);
     var x_values=data.map(d=>d.otu_id);
     var y_values=data.map(d=>d.sample_values);
     var markersize= data.map(d=>d.sample_values);
     var colorvar=data.map(d=>d.otu_id);
     var otu_label=data.map(d=>d.otu_label);
     
     
     //Bubble start
     var bubble_trace = {
      x: x_values,
      y: y_values,
      text: otu_label,
      mode: 'markers',
      marker: {
        color: colorvar,
        size: markersize,
        colorscale : 'Earth',
        cmin:0,
        cmax :3000
                 },
      
      type: 'scatter'
    };
    
    var layout = {
      title: 'Bubble Chart',
      showlegend: false,
      height: 800,
      width: 1000,
     
    
      xaxis: {
      title: {
        text: "OTU ID's",
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: "Samples",
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    
  };
    
    Plotly.newPlot('bubble', [bubble_trace], layout);
  ///bubble end

  //pie start
  var pie_trace = {

    values: y_values.slice(0,10),
    labels: x_values.slice(0,10),
    type: 'pie',
    text: otu_label.slice(0,10),
    hoverinfo:'label+percent+text',
    textinfo:'percent'
  };
  
  var pie_layout = {
    title:"Distribution of Microbes by Sample Id <br> (Top 10)",
    height: 500,
    width: 500
    
  };

  Plotly.newPlot('pie', [pie_trace], pie_layout);
  //pie end

  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Enter a speed between 0 and 9
// Enter a speed between 0 and 9
function buildGauge(sample){
  
d3.json(`/wfreq/${sample}`).then(function(data) 
 {
   var wfreq=data.WFREQ;
  

  var level = wfreq;
  
  var gaugeMaxValue = 9; 
  
  // data to calculate 
 
  
  // Trig to calc meter point
  // var degrees = percent*360;
   var degrees = ((gaugeMaxValue-level) * 180 )/gaugeMaxValue;
  // var degrees=gaugeMaxValue-level;

 //var degrees=(level/gaugeMaxValue)*180;
  console.log(`degrees ${degrees}`)
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  console.log(`x is ${x}`);
  console.log(`y is ${y}`);
  
  // Path: may have to change to create a better triangle
  var mainPath = 'M +.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  // var path = 'M +.0 -0.025 L .0 0.025 L 0.0 0.1 Z'
  console.log (`path is ${path}`)
  
  var data = [
    { 
    type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'Wash Frequency',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
    rotation: 90,
    // direction:'clockwise',
     text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2','0-1',''],
   
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)', 'rgba(120,167,28,.5)','rgba(140,187,36,.5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(222, 216, 202, .5)','rgba(232, 226, 232, .5)',
                           'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2','0-1',''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];
  
  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: 'Belly Button Wash Frequency <br> Scrubs per week',
    height: 600,
    width: 600,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  
  Plotly.newPlot('gauge', data, layout);
});
  }

  
// Initialize the dashboard
init();
