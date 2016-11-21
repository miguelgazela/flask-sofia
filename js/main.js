var RECENT_ACTIVITY_TIME_INTERVAL = 5; // in minutes
var MAP_REFRESH_RATE = 2000; // milliseconds

var map = null;
var RideLocation = null;
var lastSavedLocation = null;
var positionMarker = null;

$(document).ready(function() {

  initHeader();
  initClassList();

});

function initHeader() {

  var now = moment();

  var headerTitle = document.querySelector('.header-title');

  if (between(1, 12)) {
    headerTitle.innerHTML = "Good morning, Sofia";
  } else if (between(12, 18)) {
    headerTitle.innerHTML = "Good afternoon, Sofia";
  } else {
    headerTitle.innerHTML = "Good night, Sofia";
  }

  var headerDate = document.querySelector('.header-date');
  headerDate.innerHTML = now.format('dddd') + ", " + now.format('D MMM');

  // initialize weather info

  if (store.enabled) {

    console.log("DEBUG: Store is enabled");

    var lastWeatherFetch = store.get('lastWeatherFetch');

    if (lastWeatherFetch) {

      lastWeatherFetch = moment(lastWeatherFetch);

      if (moment().diff(lastWeatherFetch, 'seconds') < (30 * 60)) { // less than 30 minutes ago

        console.log("DEBUG: Less than 30 minutes ago");

        var temp = store.get('weatherTemp');
        var weather = store.get('weather');
        var weatherDescription = store.get('weatherDescription');
        var weatherIcon = store.get('weatherIcon');

        var headerWeather = document.querySelector('.header-weather-description');
        headerWeather.innerHTML = "" + temp + "ºc, " + weather;

        var $weatherIcon = $('.weather-icon');
        $weatherIcon.addClass(weatherIcon);

        return;
      }

    } else {
      console.log("DEBUG: No weather has been fetched");
    }

  } else {
    console.log("DEBUG: Store is disabled");
  }

  console.log("DEBUG: Making WeatherAPI request");

  $.get("https://paginas.fe.up.pt/~ei10076/projects/lgp-temp-api/weather", function(data) {

    console.log("DEBUG: Fetched weather info");
    console.log(JSON.parse(data));

    var headerWeather = document.querySelector('.header-weather-description');

    if (data) {

      data = JSON.parse(data);

      var $weatherIcon = $('.weather-icon');

      var temp = data.main.temp - 273.15;
      var weather = data.weather[0].main;
      var weatherDescription = data.weather[0].description;

      // save weather info to local storage
      if (store.enabled) {
        store.set('weatherTemp', temp);
        store.set('weather', weather);
        store.set('weatherDescription', weatherDescription);
        store.set('lastWeatherFetch', moment());
      }

      headerWeather.innerHTML = "" + temp + "ºc, " + weather;

      var isDay = between(7, 18);

      switch (weather) {

        case "Clear":

          if (isDay) {
            $weatherIcon.addClass('sunny-day');
            store.set('weatherIcon', 'sunny-day');
          } else {
            $weatherIcon.addClass('clear-night');
            store.set('weatherIcon', 'clear-night');
          }
          break;

        case "Clouds":

          if (isDay) {
            if (weatherDescription === "few clouds") {
              $weatherIcon.addClass('sun-cloudy-day');
              store.set('weatherIcon', 'sun-cloudy-day');
            } else {
              $weatherIcon.addClass('cloudy-day');
              store.set('weatherIcon', 'cloudy-day');
            }
          } else {
            $weatherIcon.addClass('cloudy-night');
            store.set('weatherIcon', 'cloudy-night');
          }
          break;

        case "Rain":

          $weatherIcon.addClass('rainy-day');
          store.set('weatherIcon', 'rainy-day');
          break;

        case "Thunderstorm":

          $weatherIcon.addClass('thunderstorm');
          store.set('weatherIcon', 'thunderstorm');
          break;

        case "Extreme":

          if (weatherDescription === "windy") {
            $weatherIcon.addClass('windy-day');
            store.set('weatherIcon', 'windy-day');
          }
          break;

        default:

      }

    } else {
      headerWeather.innerHTML = "Não consegui ver o tempo..."
    }

	});
}

function initClassList() {

  var now = moment();

  switch (now.day()) {

    case 6: // saturday
      // falls through
    case 0: // sunday

      // firstWarningDom.innerHTML = "Hoje é dia de namoro. Dá-me um beijinho rápido!";
      // secondWarningDom.innerHTML = "Amanhã começas com <span>Biologia Celular (P)</span> às 09:00 no edifício <span>1</span>, piso <span>1</span>, sala <span>E102</span>";
    break;

    case 1: // monday

      addMondayClasses();
      break;

    case 2: // tuestday

      // if (now.isSameOrAfter(now.clone().hour(6).minute(0).second(0)) && now.isSameOrBefore(now.clone().hour(08).minute(30).second(0))) {
      //   firstWarningDom.innerHTML = "Vais ter <span>Química Biológica I (T)</span> às <span>08:30</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      // } else if (now.isSameOrAfter(now.clone().hour(8).minute(30).second(0)) && now.isSameOrBefore(now.clone().hour(10).minute(30).second(0))) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Química Biologica I (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>BioFísica (T)</span> às <span>10:30</span> no <span>auditório 06</span>, <span>piso 0</span>";
      // } else if (now.isSameOrAfter(now.clone().hour(10).minute(30).second(0)) && now.isSameOrBefore(now.clone().hour(12).minute(0).second(0))) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>BioFísica (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Sociologia MEdica (TP)</span> às <span>12:00</span> no <span>auditório 06</span>, <span>piso 0</span>";
      // } else if (inClassTime(now, 12, 13)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Sociologia Médica (TP)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Nâo tens mais aulas depois desta!";
      // }
      break;

    case 3: // wednesday

      // if (inClassTime(now, 8, 11)) {
      //   firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (T)</span> às <span>11:00</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      // } else if (inClassTime(now, 11, 13)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Biologia Celular (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Genética (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
      // } else if (inClassTime(now, 13, 14)) {
      //   firstWarningDom.innerHTML = "Vais ter <span>Genética (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
      // } else if (inClassTime(now, 14, 16)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Genética (P)</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Química Orgânica I (P)</span> às <span>16:00</span> no <span>edifício 2</span>, <span>piso 1</span>, <span>sala D5</span>";
      // } else if (inClassTime(now, 16, 18)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Química Orgânica I (P)</span> no <span>edifício 2</span>, <span>piso 1</span>, <span>sala D5</span>";
      //   secondWarningDom.innerHTML = "Alegra-te, não tens mais aulas depois desta";
      // } else {
      //   firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
      // }
      break;

    case 4: // thursday

      // if (now.isSameOrAfter(now.clone().hour(8).minute(0).second(0)) && now.isSameOrBefore(now.clone().hour(10).minute(30).second(0))) {
      //   firstWarningDom.innerHTML = "Vais ter <span>BioFísica (T)</span> às <span>10:30</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      // } else if (now.isSameOrAfter(now.clone().hour(10).minute(30).second(0)) && now.isSameOrBefore(now.clone().hour(12).minute(0).second(0))) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>BioFísica (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Genética (T)</span> às <span>12:00</span> no <span>auditório 06</span>, <span>piso 0</span>";
      // } else if (inClassTime(now, 12, 13)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Genética (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Sociologia Médica (TP)</span> às <span>14:00</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      // } else if (inClassTime(now, 13, 14)) {
      //   firstWarningDom.innerHTML = "Tens <span>Sociologia Médica (TP)</span> às <span>14:00</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      // } else if (inClassTime(now, 14, 17)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Sociologia Médica (TP)</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      //   secondWarningDom.innerHTML = "Alegra-te, não tens mais aulas depois desta";
      // } else if (inClassTime(now, 17, 21)){
      //   firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
      //   secondWarningDom.innerHTML = "Amanhã começa às 08:00, mas não tens aulas de tarde!";
      // } else {
      //   firstWarningDom.innerHTML = "Amanhã começas com <span>Química Biológica I (T)</span> às <span>08:00</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      // }
      break;

    case 5: // friday

      // if (inClassTime(now, 7, 9)) {
      //   firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (P)</span> às <span>09:00</span> no <span>ed 06</span>, Piso <span>0</span>";
      // } else if (inClassTime(now, 8, 9)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Química Biológica I (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (T)</span> às <span>9:00</span> no mesmo auditório. Fica onde estás!";
      // } else if (inClassTime(now, 9, 10)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens <span>Genética Básica (T)</span> às <span>10:00</span> no mesmo auditório. Hoje não te vais mexer muito";
      // } else if (inClassTime(now, 10, 11)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>Genética Básica (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
      //   secondWarningDom.innerHTML = "Tens um hora livre entre as 11 e as 12 ;)";
      // } else if (inClassTime(now, 11, 12)) {
      //   firstWarningDom.innerHTML = "Yeei, uma hora livre para descansares. Estuda!";
      //   secondWarningDom.innerHTML = "Tens <span>BioFísica (P)</span> às <span>12:00</span> no <span>Auditório 6</span>, <span>piso 0</span>"
      // } else if (inClassTime(now, 12, 13)) {
      //   firstWarningDom.innerHTML = "Devias estar a ter <span>BioFísica (P)</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      //   secondWarningDom.innerHTML = "TGIF!";
      // } else {
      //   firstWarningDom.innerHTML = "Hoje é a nossa noite!";
      // }
      break;

    default:

  }
}

function addClasses(classInfo) {

  var classTmpl = $.templates("#class-item-tmpl");

  for (var i = 0; i < classInfo.length; i++) {
    $('.list-class-items').append(classTmpl.render(classInfo[i]));
  }
}

function addMondayClasses() {

  var classInfo = [];

  if (between(0, 9)) {
    classInfo.push({className: "Biologia Celular", classStarts: "09:00", classEnds: "11:00", classLocation: "E1, P1, Sala E102", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(9, 11)) {
    classInfo.push({className: "Biologia Celular", classStarts: "09:00", classEnds: "11:00", classLocation: "E1, P1, Sala E102", classType: "P", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Métodos Quantitativos", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Sala EA02", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(11, 13)) {
    classInfo.push({className: "Métodos Quantitativos", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Sala EA02", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Métodos Quantitativos", classStarts: "14:00", classEnds: "17:00", classLocation: "E3, P1, Sala E311", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(13, 14)) {
    classInfo.push({className: "Métodos Quantitativos", classStarts: "14:00", classEnds: "17:00", classLocation: "E3, P1, Sala E311", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(14, 17)) {
    classInfo.push({className: "Métodos Quantitativos", classStarts: "14:00", classEnds: "17:00", classLocation: "E3, P1, Sala E311", classType: "P", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Quimíca Biológica", classStarts: "08:30", classEnds: "10:30", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Tuesday"});
  } else {
    classInfo.push({className: "Quimíca Biológica", classStarts: "08:30", classEnds: "10:30", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Tuesday"});
  }

  addClasses(classInfo);

  // if (inClassTime(now, 8, 9)) {
  //   firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (P)</span> às <span>09:00</span> no <span>edifício 1</span>, <span>piso 1</span>, sala <span>E102</span>";
  // } else if (inClassTime(now, 9, 11)) {
  //   firstWarningDom.innerHTML = "Devias estar a ter <span>Biologia Celular (P)</span> no <span>edifício 1</span>, <span>piso 1</span>, sala <span>E102</span>";
  //   secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (T)</span> às <span>11:00</span> no edifício <span>A</span>, <span>piso 0</span>, <span>sala EA02</span>";
  // } else if (inClassTime(now, 11, 13)) {
  //   firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (T)</span> no <span>edifício A</span>, <span>piso 0</span>, <span>sala EA02</span>";
  //   secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E311</span>";
  // } else if (inClassTime(now, 14, 17)) {
  //   firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (P)</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E311</span>";
  //   secondWarningDom.innerHTML = "E não tens mais aulas hoje! Yeei! Não te esqueaças de me mandar uma sms <3";
  // } else {
  //   firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
  //   secondWarningDom.innerHTML = "Amanhã começas às 08:30 com <span>Quimíca Biológica I (T)</span> no <span>edifício A</span>, <span>piso 0</span>, <span>auditório 06</span>";
  // }

}

function addTuesdayClasses() {

}

function addWednesdayClasses() {

}

function addThursdayClasses() {

}

function addFridayClasses() {

}

function addWeekendClasses() {

}

// MAP & RIDE MONITORING

function initMap() {

  // Create a map object and specify the DOM element for display.

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.14852999340849, lng: -8.606939837344555}, // Porto!
    scrollwheel: true,
    zoom: 16,
    mapTypeControl: false,
  });

  Parse.initialize('Ryl6jYhQ3iK0sJuYDwQLgIzyxbMfWQZXifnj2VzPYoGETPafPeg7iCN47rcwPXIY','unused');
  Parse.serverURL = 'https://m3parseserver.herokuapp.com/parse';

  RideLocation = Parse.Object.extend('ride_location');

  var rideLocationQuery = new Parse.Query(RideLocation);
  rideLocationQuery.descending('timestamp');

  // Check if there's any recent location events

  rideLocationQuery.first({
    success: function(object) {

      if (object) {

        console.log("Last saved location:");
        console.log(object);

        var rideLocationMoment = moment(object.get('timestamp'));
        var now = moment();

        var diffSecs = now.diff(rideLocationMoment, 'seconds');

        // if any location in the previous minutes

        if (diffSecs < (RECENT_ACTIVITY_TIME_INTERVAL * 60)) {
          startMonitoringActivity();
        } else {
          console.log("No recent activity to display...");
        }
      }

    },
    error: function(error) {
      console.log("Error getting last location: " + error.code + " " + error.message);
    }
  });
}

function startMonitoringActivity() {

  console.log("Start monitoring activity...");

  var rideLocationQuery = new Parse.Query(RideLocation);
  rideLocationQuery.descending('timestamp');

  rideLocationQuery.first({
    success: function(object) {

      if (object) {

        console.log(object);

        if (lastSavedLocation && (lastSavedLocation.get('latitude') == object.get('latitude') && lastSavedLocation.get('longitude') == object.get('longitude'))) {

          console.log("Same location as before...");

          setTimeout(startMonitoringActivity, 2000);
          return;
        }

        // should add a marker to the map and remove the previous one

        if (positionMarker) {

          console.log("Clearing map from previous position marker...");

          positionMarker.setMap(null);
          positionMarker = null;
        }

        var latLng = new google.maps.LatLng(object.get('latitude'), object.get('longitude'));

        positionMarker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        map.setCenter(latLng);

        lastSavedLocation = object;
        setTimeout(startMonitoringActivity, 2000);
      }


    },
    error: function(error) {
      console.log("Error getting last location: " + error.code + " " + error.message);
    }
  });
}


// UTILITY FUNCTIONS

function between(start, end) {

  var now = moment();
  return now.isSameOrAfter(now.clone().hour(start).minute(0).second(0)) && now.isSameOrBefore(now.clone().hour(end).minute(0).second(0));
}
