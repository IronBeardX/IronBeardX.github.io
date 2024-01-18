var ERAS_TEXTS_IDS = ["golden_age", "wartime", "silver_age", "bronze_age", "the_dark_age", "disney_renaissance", "post_renaissance", "revival_era"]
var POSTER_SET = new Set();//TODO: change later

// /* <input type="radio" id="string" name="filter_option" value=<string>>
// <label for="string">string</label> */

// function genSecondChart(data, filter) {
//   // creating the chart:
//   const ctx = $("#second_chart");

//   const options = {
//     scales: {
//       x: {
//         stacked: true,
//         title: {
//           display: true,
//           text: "Eras"
//         }
//       },
//       y: {
//         stacked: true,
//         title: {
//           display: false,
//         }
//       }
//     }
//   }
  
//   const labels = [];
//   const colors = [];
//   const dataset_main_tags = data.filters[filter].main.relevant_tags
//   const dataset_secondary_tags = data.filters[filter].secondary.relevant_tags
//   const dataset_main_data = [];
//   const dataset_secondary_data = [];

  
// }

// function secondChart(data) {
//   filters = Object.keys(data.filters);
//   console.log(filters)

//   for (const filter of filters){
//     const filter_container = $("#filter_selection");
//     const filter_div = $("<div>").addClass("px-4");
//     const filter_label = $("<label>").attr("for", filter).text(data.filters[filter].representation);
//     const filter_input = $("<input>").attr("type", "radio").attr("id", filter).attr("name", "filter_option").attr("value", filter);
//     filter_div.append(filter_input);
//     filter_div.append(filter_label);
//     filter_container.append(filter_div);
//   }
  
//   // Preselect the first one:
//   $("#filter_selection input").first().prop("checked", true);

//   // Generate a chart with the first filter:
//   genSecondChart(data, $("#filter_selection input").first().val());
// }

function processDisneyData(data) {
  // Your data processing logic goes here
}

function countFilmsByYearAndTag(database, startYear, endYear, tag) {
  const result = Array(endYear - startYear + 1).fill(0);
  // film_in_era = 0;//TODO: Remove when done.
  
  POSTER_SET = new Set();//TODO: Remove when done.
  for (const filmKey in database) {
    for (const posterKey in database[filmKey].posters) {
      const poster = database[filmKey].posters[posterKey];
      const releaseYear = parseInt(poster.release_date);
      if (releaseYear <= endYear && releaseYear >= startYear){
        // film_in_era += 1;
        POSTER_SET.add(posterKey);
      }//TODO: Remove when done.
      if (releaseYear <= endYear && releaseYear >= startYear && poster.tags.includes(tag)) {
        result[releaseYear - startYear] += 1;
      }
    }
  }
  // console.log(film_in_era)
  return result;
}

function displayEraPosters(era, poster_list){
  // const poster_container = $("#" + era + "_posters");
  // poster_container.html("<img src=\"./img/posters/a_bugs_life_v1.jpg\" alt=\"Posters\">");
  // for (const poster of poster_list){
  //   const poster_div = $("<div>").addClass("poster");
  //   const poster_img = $("<img>").attr("src", poster.image_url);
  //   poster_div.append(poster_img);
  //   poster_container.append(poster_div);
  // }
}

async function populateErasDropdown(data) {
  // Select the dropdown element
  const selectDropdown = $('#era_select');

  // Loop through the array and add options to the dropdown
  for (const [key, value] of Object.entries(data.disney_eras)) {
    const option = $('<option>').text(value.display_name).val(key);
    selectDropdown.append(option);
  }
  const selected_value = selectDropdown.val();
  first_chart = await genBarChart(selected_value, data);

  for (id of ERAS_TEXTS_IDS){
    if (id != selected_value){
      $("#" + id).hide()
    } 
  }

  // Add an event listener to respond when the selection changes
  selectDropdown.on('change', function() {
      const selected_value = $(this).val();
      first_chart.destroy();// TODO change this so i dont have to redo the charts every time 
      genBarChart(selected_value, data);
      const era_text = data.disney_eras[selected_value].notes;for (id of ERAS_TEXTS_IDS){
        if (id != selected_value){
          $("#" + id).hide()
        }
        else{
          $("#" + id).show()
          console.log(POSTER_SET);
        }
      }
  });
}

async function genBarChart(era, data){
  const range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i);
  // creating the chart:
  const ctx = $("#first_chart");

	const options = {
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Años"
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Cantidad de Etiquetas por Año"
        }
      }
    }
	};
  
  start_year = data.disney_eras[era].period_start;
  end_year = data.disney_eras[era].period_end;
  
  var datasets = [];
  for (const tag of Object.keys(data.tags)){
    const tag_data = {
      data: countFilmsByYearAndTag(data.films, start_year, end_year, tag),
      backgroundColor: data.tags[tag].color,
      maxBarThickness: 50,
      categoryPercentage: 0.5,
    }
    // Check ig theres any number different than zero in tag_data.data (its an array) and if so add tag as label
    if (tag_data.data.some((value) => value !== 0)){
      tag_data.label = tag;
      // console.log(tag);
      // console.log(tag_data.data.reduce((a, b) => a + b, 0));
      datasets.push(tag_data);
    }
  }

  const chart_data = {
    labels: range(start_year, end_year),
    datasets: datasets
  }

	first_chart = new Chart(ctx, {
		type: 'bar',
		data: chart_data,
		options: options
	});

  return first_chart
}

function updateSections(data) {
	// First Chart
  // populating the select dropdown:
  populateErasDropdown(data);
  // Second Chart
  secondChart(data);
}

$(async function () {
  $.ajax({
      url: 'data_v2.json',
      dataType: 'json',
      success: function(data) {
        updateSections(data);
      },
      error: function(error) {
          console.error('Error loading JSON data:', error);
      }
  });

});

