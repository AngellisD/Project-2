// Generate list of available areas

$.get(`/area_name`, function(areaResponse){
  console.log(areaResponse);
  var tbody = document.getElementById("tbody");
  for (var i=0;i<areaResponse['available_areas'].length; i++){
    var tr = document.createElement("tr");
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(areaResponse['available_areas'][i]['AreaName']));
    tr.appendChild(td);
    tbody.appendChild(tr);
  
  }
});
$.get(`/area_name`, function builCharts(traffic_collision){
  console.log(areaResponse);
  let AreaID = areaResponse.are_ids,
  let Names = areaResponse.names;
  let areaLabels = areaResponse.area_labels;

   // @TODO: Build a Pie Chart
   let trace1 = {
    x: otuID,
    y: sampleValues,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuID,
      colorscale: 'Earth'
    }
  };

  // HINT: You will need to use slice() to grab the top 10 sample_values,

  let data = [trace1];

  let layout = {
  title: 'Bubble Chart'
};

Plotly.newPlot('bubble', data, layout);
})
// otu_ids, and labels (10 each).
d3.json(`/samples/${sample}`).then(sampleData => {
  console.log(sampleData);

  let pie_values=sampleData.sample_values.slice(0,10);
  let pie_labels=sampleData.otu_ids.slice(0,10);
  let pie_hover=sampleData.otu_labels.slice(0,10);

  let data =[{
    values:pie_values,
    labels:pie_labels,
    hovertext:pie_hover,
    type: 'pie'
  }];
  Plotly.newPlot('pie', data); 
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
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();


// Generate map using area name

$("#submit").on("click",function(event){
  event.preventDefault();
  var name = $("#inputName").val().trim();
  var zip = $("#inputArea_ID").val().trim();

  if (name === '' && zip ===''){
      alert('Kindly enter Name or Zip and press Submit');
  }

  else if (zip === '' && name !== ''){
      // call flask and ask for info on the city name
      console.log(name)
      $.get(`/get_city_by_name/${name}`, function(cityResponse){
        
        if(cityResponse.city.length === 0){
          alert("Information for the City Name you entered not found. Please try with another City Name");
        }

        else{

          // Erase previous map
          if(map != undefined || map != null){
            map.remove();
           $("#map").html("");
           $("#preMap").empty();
           $( "<div id=\"map\" style=\"height: 500px;\"></div>" ).appendTo("#preMap");
          }

          // Create a map object
          var myMap = L.map("map", {
            center: [34.11, -118.32],
            zoom: 11
          });

          // Add a tile layer
          L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {              
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: "pk.eyJ1IjoiYW5nZWxsaXMiLCJhIjoiY2p3bGZseWptMTNneTN5cDl0NWY0dno5cSJ9.VWnRWInDd-icwQTHJ7_T0w"
          }).addTo(myMap);
          
          // Generate locations list
          var cities =[]
          for (var i=0; i<100;i++){
            cities[i] = {'location': [cityResponse['city'][i]['Latitude'], cityResponse['city'][i]['Longitude']], 'Date': cityResponse['city'][i]['DateOccurred']}
          }
          
          // Generate markers
          for (var i = 0; i < cities.length; i++) {
            var c = cities[i];
            L.marker(c.location)
            .bindPopup("<p> Date of accident: " + c.Date + "</p>")
            .addTo(myMap);
          }
         
        }
      });
  } 

  else if (name === '' && zip !==''){
      if (zip.length !== 5){
          alert("You Entered an invalid Zip Code!");
      }
      else{
          // call flask and ask for info on the city by zip
          $.get(`/get_city_by_zip/${zip}`, function(zipResponse){
            
            if(zipResponse.zip.length === 0){
              alert("Information for the ZipCode you entered not found. Please try with another Zip Code");
            }
            
            else{
              
              // Erase previous map
              if(map != undefined || map != null){
                map.remove();
              $("#map").html("");
              $("#preMap").empty();
              $( "<div id=\"map\" style=\"height: 500px;\"></div>" ).appendTo("#preMap");
              }

              // Create a map object
              var myMap = L.map("map", {
                center: [34.11, -118.32],
                zoom: 11
              });

              // Add a tile layer
              L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {              
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                maxZoom: 18,
                id: "mapbox.streets",
                accessToken: "pk.eyJ1IjoiYW5nZWxsaXMiLCJhIjoiY2p3bGZseWptMTNneTN5cDl0NWY0dno5cSJ9.VWnRWInDd-icwQTHJ7_T0w"
              }).addTo(myMap);
              
              // Generate locations list
              var cities =[]
              for (var i=0; i<100;i++){
                cities[i] = {'location': [zipResponse['zip'][i]['Latitude'], zipResponse['zip'][i]['Longitude']], 'Date': zipResponse['zip'][i]['DateOccurred']}
              }
               
              // Generate markers
              for (var i = 0; i < cities.length; i++) {
                var c = cities[i];
                L.marker(c.location)
                .bindPopup("<p>Date of accident:" + c.Date + "</p>")
                .addTo(myMap);
              }
            }
          });
      }
  }

  else if (name !=='' && zip !== ''){
      alert('You must only enter for Name or Zip but not both!');
  }
  
});
