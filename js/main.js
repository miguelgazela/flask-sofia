$(document).ready(function() {

  var now = moment();

  var firstWarningDom = document.querySelector('#first_warning');
  var secondWarningDom = document.querySelector('#second_warning');

  switch (now.day()) {
    case 0: // sunday

      console.log("Sunday");

      firstWarningDom.innerHTML = "Hoje é dia de namoro. Dá-me um beijinho rápido!";
      secondWarningDom.innerHTML = "Amanhã começas com <span>Biologia Celular (P)</span> às 09:00 no edifício <span>1</span>, piso <span>1</span>, sala <span>E102</span>";

    break;
    case 6: // saturday
      break;
    case 1: // monday

      console.log("Monday");

      if (inClassTime(now, 8, 9)) {
        firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (P)</span> às <span>09:00</span> no <span>edifício 1</span>, <span>piso 1</span>, sala <span>E102</span>";
      } else if (inClassTime(now, 9, 11)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Biologia Celular (P)</span> no <span>edifício 1</span>, <span>piso 1</span>, sala <span>E102</span>";
        secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (T)</span> às <span>11:00</span> no edifício <span>A</span>, <span>piso 0</span>, <span>sala EA02</span>";
      } else if (inClassTime(now, 11, 13)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (T)</span> no <span>edifício A</span>, <span>piso 0</span>, <span>sala EA02</span>";
        secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E311</span>";
      } else if (inClassTime(now, 14, 17)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (P)</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E311</span>";
        secondWarningDom.innerHTML = "E não tens mais aulas hoje! Yeei! Não te esqueaças de me mandar uma sms <3";
      } else {
        firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
        secondWarningDom.innerHTML = "Amanhã começas às 08:30 com <span>Quimíca Biológica I (T)</span> no <span>edifício A</span>, <span>piso 0</span>, <span>auditório 06</span>";
      }

      break;
    case 2: // tuestday

      console.log("Tuesday");

      break;
    case 3: // wednesday

      console.log("Wednesday");

      if (inClassTime(now, 8, 11)) {
        firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (T)</span> às <span>11:00</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      } else if (inClassTime(now, 11, 13)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Biologia Celular (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens <span>Genética (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
      } else if (inClassTime(now, 13, 14)) {
        firstWarningDom.innerHTML = "Vais ter <span>Genética (P)</span> às <span>14:00</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
      } else if (inClassTime(now, 14, 16)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Genética (P)</span> no <span>edifício 3</span>, <span>piso 1</span>, <span>sala E305</span>";
        secondWarningDom.innerHTML = "Tens <span>Química Orgânica I (P)</span> às <span>16:00</span> no <span>edifício 2</span>, <span>piso 1</span>, <span>sala D5</span>";
      } else if (inClassTime(now, 16, 18)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Química Orgânica I (P)</span> no <span>edifício 2</span>, <span>piso 1</span>, <span>sala D5</span>";
        secondWarningDom.innerHTML = "Alegra-te, não tens mais aulas depois desta";
      } else {
        firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
      }

      break;
    case 4: // thursday

      console.log("Thursday");

      if (now.isSameOrAfter(now.clone().hour(8).minute(0).second(0)) && now.isSameOrBefore(now.clone().hour(10).minute(30).second(0))) {
        firstWarningDom.innerHTML = "Vais ter <span>BioFísica (T)</span> às <span>10:30</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      } else if (now.isSameOrAfter(now.clone().hour(10).minute(30).second(0)) && now.isSameOrBefore(now.clone().hour(12).minute(0).second(0))) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>BioFísica (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens <span>Genética (T)</span> às <span>12:00</span> no <span>auditório 06</span>, <span>piso 0</span>";
      } else if (inClassTime(now, 12, 13)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Genética (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens <span>Sociologia Médica (TP)</span> às <span>14:00</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      } else if (inClassTime(now, 13, 14)) {
        firstWarningDom.innerHTML = "Tens <span>Sociologia Médica (TP)</span> às <span>14:00</span> no <span>Auditório 6</span>, <span>piso 0</span>";
      } else if (inClassTime(now, 14, 17)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Sociologia Médica (TP)</span> no <span>Auditório 6</span>, <span>piso 0</span>";
        secondWarningDom.innerHTML = "Alegra-te, não tens mais aulas depois desta";
      } else if (inClassTime(now, 17, 21)){
        firstWarningDom.innerHTML = "Rejubila, não tens mais aulas hoje!";
        secondWarningDom.innerHTML = "Amanhã começa às 08:00, mas não tens aulas de tarde!";
      } else {
        firstWarningDom.innerHTML = "Amanhã começas com <span>Química Biológica I (T)</span> às <span>08:00</span> no <span>Auditório 06</span>, Piso <span>0</span>";
      }

      break;
    case 5: // friday

      if (inClassTime(now, 7, 9)) {
        firstWarningDom.innerHTML = "Vais ter <span>Biologia Celular (P)</span> às <span>09:00</span> no <span>ed 06</span>, Piso <span>0</span>";
      } else if (inClassTime(now, 8, 9)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Química Biológica I (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens <span>Métodos Quantitativos (T)</span> às <span>9:00</span> no mesmo auditório. Fica onde estás!";
      } else if (inClassTime(now, 9, 10)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Métodos Quantitativos (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens <span>Genética Básica (T)</span> às <span>10:00</span> no mesmo auditório. Hoje não te vais mexer muito";
      } else if (inClassTime(now, 10, 11)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>Genética Básica (T)</span> no <span>Auditório 06</span>, <span>Piso 0</span>";
        secondWarningDom.innerHTML = "Tens um hora livre entre as 11 e as 12 ;)";
      } else if (inClassTime(now, 11, 12)) {
        firstWarningDom.innerHTML = "Yeei, uma hora livre para descansares. Estuda!";
        secondWarningDom.innerHTML = "Tens <span>BioFísica (P)</span> às <span>12:00</span> no <span>Auditório 6</span>, <span>piso 0</span>"
      } else if (inClassTime(now, 12, 13)) {
        firstWarningDom.innerHTML = "Devias estar a ter <span>BioFísica (P)</span> no <span>Auditório 6</span>, <span>piso 0</span>";
        secondWarningDom.innerHTML = "TGIF!";
      } else {
        firstWarningDom.innerHTML = "Hoje é a nossa noite!";
      }

      break;
    default:

  }

  // fetching a love quote for the day

  $.get('https://quotes.rest/qod.json?category=love', function(data) {

    if (data.success) {

      var quoteObj = data.contents.quotes[0];
      var quoteDom = document.querySelector("#quote");

      if (quoteObj.quote) {
        quoteDom.innerHTML = quoteObj.quote;
      } else {
        quoteDom.innerHTML = "Adoro-te imenso, sabias? És o meu mundo...";
      }


    }

  });

});

function initMap() {

  // Create a map object and specify the DOM element for display.

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });

}

function inClassTime(currentTime, starts, ends) {
  return currentTime.isSameOrAfter(currentTime.clone().hour(starts).minute(0).second(0)) && currentTime.isSameOrBefore(currentTime.clone().hour(ends).minute(0).second(0));
}
