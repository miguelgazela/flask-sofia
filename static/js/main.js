
var RECENT_ACTIVITY_TIME_INTERVAL_MIN = 15; // in minutes
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

  console.log("DEBUG: initializing header section");

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

    console.log("DEBUG: localstore enabled");

    var lastWeatherFetch = store.get('lastWeatherFetch');
    if (lastWeatherFetch) {

      console.log("DEBUG: has fetched weather info before");

      lastWeatherFetch = moment(lastWeatherFetch);

      if (moment().diff(lastWeatherFetch, 'seconds') < (30 * 60)) { // less than 30 minutes ago

        console.log("DEBUG: less than 30 minutes ago, using cached data");

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
      console.log("DEBUG: no weather info available");
    }
  } else {
    console.log("DEBUG: localstore disabled");
  }

  console.log("DEBUG: performing WeatherAPI request");

  $.get("/weather", function(data) {

    console.log("DEBUG: finished request");

    var headerWeather = document.querySelector('.header-weather-description');

    if (data) {

      console.log("DEBUG: received valid weather data");

      data = JSON.parse(data);

      var $weatherIcon = $('.weather-icon');

      var temp = data.main.temp - 273.15;
      var weather = data.weather[0].main;
      var weatherDescription = data.weather[0].description;

      // save weather info to local storage
      if (store.enabled) {

        console.log("DEBUG: saving weather info to localstore");

        store.set('weatherTemp', temp);
        store.set('weather', weather);
        store.set('weatherDescription', weatherDescription);
        store.set('lastWeatherFetch', moment());
      }

      console.log("DEBUG: finding correct weather icon");

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
      headerWeather.innerHTML = "No weather info available..."
    }

	});
}

function initClassList() {

  console.log("DEBUG: initializing class list section");

  var now = moment();

  switch (now.day()) {

    case 6: // saturday
      // falls through
    case 0: // sunday

      addWeekendClasses();
      break;

    case 1: // monday

      addMondayClasses();
      break;

    case 2: // tuestday

      addTuesdayClasses();
      break;

    case 3: // wednesday

      addWednesdayClasses();
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

      addFridayClasses();
      break;

    default:

  }
}

function addClasses(classInfo) {

  var classTmpl = $.templates('<li class="list-group-item row-container"><div class="sidebar"><div class="sidebar-timer"><span class="glyphicon glyphicon-time {{:timerIconHiddenClass}}" aria-hidden="true"></span><span>{{:timeLeft}}</span></div></div><div class="content row-container"><div class="class-info {{:classActiveClass}}"><p class="class-info-primary">{{:className}}</p><p>{{:tomorrowWarning}}</p><p>{{:classStarts}} - {{:classEnds}}</p><p>{{:classLocation}}</p></div><div class="class-state"><span>{{:classType}}</span></div></div></li>');

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
}

function addTuesdayClasses() {

  var classInfo = [];

  if (between(0, 0, 8, 30)) {
    classInfo.push({className: "Química Biológica", classStarts: "08:30", classEnds: "10:30", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(8, 30, 10, 30)) {
    classInfo.push({className: "Química Biológica", classStarts: "08:30", classEnds: "10:30", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "BioFísica", classStarts: "10:30", classEnds: "12:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(10, 30, 12, 00)) {
    classInfo.push({className: "BioFísica", classStarts: "10:30", classEnds: "12:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Sociologia Médica", classStarts: "12:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "TP", timerIconHiddenClass: "hidden"});
  } else if (between(12, 13)) {
    classInfo.push({className: "Sociologia Médica", classStarts: "12:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "TP", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Biologia Celular", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Wednesday"});
  } else {
    classInfo.push({className: "Biologia Celular", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Wednesday"});
  }

  addClasses(classInfo);
}

function addWednesdayClasses() {

  var classInfo = [];

  if (between(0, 11)) {
    classInfo.push({className: "Biologia Celular", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(11, 13)) {
    classInfo.push({className: "Biologia Celular", classStarts: "11:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Genética Básica", classStarts: "14:00", classEnds: "16:00", classLocation: "E3, P1, E305", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(13, 14)) {
    classInfo.push({className: "Genética Básica", classStarts: "14:00", classEnds: "16:00", classLocation: "E3, P1, E305", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(14, 16)) {
    classInfo.push({className: "Genética Básica", classStarts: "14:00", classEnds: "16:00", classLocation: "E3, P1, E305", classType: "P", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Química Biológica I", classStarts: "16:00", classEnds: "18:00", classLocation: "E3, P1, Sala 12", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(16, 18)) {
    classInfo.push({className: "Química Biológica I", classStarts: "16:00", classEnds: "18:00", classLocation: "E3, P1, Sala 12", classType: "P", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "BioFísica", classStarts: "10:30", classEnds: "12:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Wednesday"});
  } else {
    classInfo.push({className: "BioFísica", classStarts: "10:30", classEnds: "12:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", tomorrowWarning: "Tomorrow, Wednesday"});
  }

  addClasses(classInfo);
}

function addThursdayClasses() {

  var classInfo = [];

  // TODO: add code here

  addClasses(classInfo);
}

function addFridayClasses() {

  var classInfo = [];

  if (between(0, 8)) {
    classInfo.push({className: "Química Biológica I", classStarts: "08:00", classEnds: "09:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(8, 9)) {
    classInfo.push({className: "Química Biológica I", classStarts: "08:00", classEnds: "09:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Métodos Quantitativos", classStarts: "09:00", classEnds: "10:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(9, 10)) {
    classInfo.push({className: "Métodos Quantitativos", classStarts: "09:00", classEnds: "10:00", classLocation: "EA, P0, Auditório 06", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "Genética Básica", classStarts: "10:00", classEnds: "11:00", classLocation: "EA, P0, Auditório 01", classType: "T", timerIconHiddenClass: "hidden"});
  } else if (between(10, 11)) {
    classInfo.push({className: "Genética Básica", classStarts: "10:00", classEnds: "11:00", classLocation: "EA, P0, Auditório 01", classType: "T", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
    classInfo.push({className: "BioFísica", classStarts: "12:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 01", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(11, 12)) {
    classInfo.push({className: "BioFísica", classStarts: "12:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 01", classType: "P", timerIconHiddenClass: "hidden"});
  } else if (between(12, 13)) {
    classInfo.push({className: "BioFísica", classStarts: "12:00", classEnds: "13:00", classLocation: "EA, P0, Auditório 01", classType: "P", timerIconHiddenClass: "hidden", classActiveClass: "class-active"});
  } else {
        classInfo.push({className: "Encontro com o Miguel", classStarts: "15:00", classEnds: "03:00", classLocation: "Muitos sítios", classType: "P", timerIconHiddenClass: "hidden"});
  }

  addClasses(classInfo);
}

function addWeekendClasses() {

  var classInfo = [];

  classInfo.push({className: "Biologia Celular", classStarts: "09:00", classEnds: "11:00", classLocation: "E1, P1, Sala E102", classType: "P", timerIconHiddenClass: "hidden"});

  addClasses(classInfo);
}

// MAP & RIDE MONITORING

function initMap() {

  Parse.initialize('Ryl6jYhQ3iK0sJuYDwQLgIzyxbMfWQZXifnj2VzPYoGETPafPeg7iCN47rcwPXIY','unused');
  Parse.serverURL = 'https://m3parseserver.herokuapp.com/parse';

  RideLocation = Parse.Object.extend('ride_location');
  var rideLocationQuery = new Parse.Query(RideLocation);
  rideLocationQuery.descending('timestamp');

  // Check if there's any recent location events

  rideLocationQuery.first({
    success: function(object) {

      if (object) {

        console.log("DEBUG: fetched last location event");

        var rideLocationMoment = moment(object.get('timestamp'));
        var now = moment();

        var diffSecs = now.diff(rideLocationMoment, 'seconds');

        // if any location in the previous RECENT_ACTIVITY_TIME_INTERVAL_MIN minutes

        if (diffSecs < (RECENT_ACTIVITY_TIME_INTERVAL_MIN * 60)) {

          $('.trip-warning').addClass('hidden');
          $('.trip-stats').removeClass('hidden');

          // Create a map object and specify the DOM element for display.

          map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 41.14852999340849, lng: -8.606939837344555}, // Porto!
            scrollwheel: true,
            zoom: 16,
            mapTypeControl: false,
          });

          watchActivity();
          return;

        } else {
          console.log("DEBUG: no active ride available");
        }

      } else {
        console.log("DEBUG: no active ride available");
      }

      $('.trip-warning').removeClass('hidden');
    },
    error: function(error) {
      console.log("ERROR: fetching last location " + error.code + " [" + error.message + "]");
    }
  });
}

function watchActivity() {

  console.log("DEBUG: watching recent activity");

  var rideLocationQuery = new Parse.Query(RideLocation);
  rideLocationQuery.descending('timestamp');

  rideLocationQuery.first({
    success: function(object) {

      if (object) {

        if (lastSavedLocation && (lastSavedLocation.get('latitude') == object.get('latitude') && lastSavedLocation.get('longitude') == object.get('longitude'))) {

          console.log("DEBUG: no movement since last event");
          setTimeout(watchActivity, 2000);
          return;
        }

        // should add a marker to the map and remove the previous one

        if (positionMarker) {
          positionMarker.setMap(null);
          positionMarker = null;
        }

        var latLng = new google.maps.LatLng(object.get('latitude'), object.get('longitude'));

        positionMarker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        map.setCenter(latLng);

        // change velocity label

        var speed = parseInt(object.get('speed'));
        if (speed) {

          var speedLabel = $('#trip-speed');

          if (speed >= 0) {

            speed = (speed * 3600.0) / 1000.0;
            speedLabel.html('' + speed + " Km/h");

          } else {
            speedLabel.html("0 Km/h");
          }
        }

        lastSavedLocation = object;
        setTimeout(watchActivity, 2000);
      }
    },
    error: function(error) {

      console.log("ERROR: fetching last location " + error.code + " [" + error.message + "]");

      // TODO: add backoff here after x tries
      setTimeout(watchActivity, 2000);
    }
  });
}


// UTILITY FUNCTIONS

function between(start, end) {

  var now = moment();

  console.log(arguments.length);

  if (arguments.length == 2) {
    return now.isSameOrAfter(now.clone().hour(start).minute(0).second(0)) && now.isSameOrBefore(now.clone().hour(end).minute(0).second(0));
  } else if (arguments.length == 4) {
    return now.isSameOrAfter(now.clone().hour(arguments[0]).minute(arguments[1]).second(0)) && now.isSameOrBefore(now.clone().hour(arguments[2]).minute(arguments[3]).second(0));
  }


}
