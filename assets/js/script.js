// VARIABLES
var body = document.querySelector("body");
var headerSection = document.querySelector("header");
var mainSection = document.querySelector("main");
var appointmentEntrySection = document.querySelector(".create-appointment-entry");
var appointmentEntryButton = document.querySelector(".create-appointment-entry-button");
var appointmentDateSection = document.querySelector(".appointment-date");
var monthArticle = document.querySelector(".months");
var dayArticle = document.querySelector(".days");
var hourArticle = document.querySelector('.appointment-hour');
var minuteArticle = document.querySelector('.appointment-minute');
var appointmentDetailsSection = document.querySelector(".appointment-details");
var dateParagraphContainer = document.querySelector(".date-description");
var appointmentCardSection = document.querySelector(".appointment-cards");
var appointmentContainer = document.querySelector(".appt-container");
// Using moment.js for the dates - year, month and day
var m = moment();
var currentYear = m.format("YYYY");
var currentMonth = m.format("MMMM");
var currentMonthNumber = m.format("MM");
var currentDate = m.format("D");
var monthsArray = moment.months();
var daysArray = [];
var hoursArray = ["08", "09", "10", "11", "12", "13", "14","15", "16", "17", "18", "19", "20", "21", "22", "23"];
var minutesArray = ["00","05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
var dayOfWeek,
  dateChosen,
  monthChosen,
  userName,
  appointmentDate,
  appointmentStartTime,
  appointmentWith,
  appointmentWhom,
  appointmentAddress,
  formattedDate,
  formattedMonth;

var currentMonthIndex = monthsArray.indexOf(currentMonth);
appointmentDetails = [];

function saveAppointmentDetails(){
    localStorage.setItem("myAppointmentDetails", JSON.stringify(appointmentDetails))
}

function loadAppointmentDetails() {
    var storedAppointmentDetails = JSON.parse(localStorage.getItem("myAppointmentDetails"));
    if (storedAppointmentDetails !== null) {
        appointmentDetails = storedAppointmentDetails;
    }
    renderAppointments();
}

/* FUNCTION FOR THE FIRST STEP IN THE CREATE APPOINTMENT PROCESS */
// When the Create Appointment Entry Button is clicked, a list of months will be displayed
function startEntry() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  appointmentEntrySection.setAttribute("class", "is-hidden");
  appointmentDateSection.setAttribute("class", "appointment-date box is-block mx-3");

  // Creating the month buttons and appending it all to the month article
  for (i = 0; i < monthsArray.length; i++) {
    var monthValue = monthsArray[i];

    var monthButton = document.createElement("button");
    monthButton.setAttribute("class", "month button is-link mx-1 mt-3");
    monthButton.setAttribute("data-month", monthValue);
    monthButton.setAttribute("id", monthValue);
    monthButton.textContent = monthValue;
    monthArticle.append(monthButton);
  }
  var numberOfMonthButtons = appointmentDateSection.querySelectorAll(".month");
  numberOfElementsShown(numberOfMonthButtons, 12);
  // Attaching click event to current and future months in the year. The past month buttons are disabled
  var monthButtonSelect = monthArticle.querySelectorAll("button");
  for (i = currentMonthIndex; i < monthButtonSelect.length; i++) {
    monthButtonSelect[i].addEventListener("click", monthSelected);
  }
  for (i = currentMonthIndex - 1; i > -1; i--) {
    monthButtonSelect[i].setAttribute("title", "Disabled button");
    monthButtonSelect[i].setAttribute("disabled", "");
  }
  monthButtonHighlight(monthButtonSelect, currentMonthIndex);
}

// Once the month is selected by the user, a list of days for that month will be displayed
function monthSelected() {
  monthChosen = this.getAttribute("data-month"); 

  // Changing the selected month button colour when clicked
  var monthChosenIndex = monthsArray.indexOf(monthChosen);
  var monthArticle = document.querySelector(".months");
  var monthButtonSelect = monthArticle.querySelectorAll("button");
  for (i = 0; i < monthsArray.length; i++) {
    monthButtonSelect[i].setAttribute("class", "month button is-link mx-1 mt-3");
    monthButtonSelect[currentMonthIndex].setAttribute("class", "month button is-link mx-1 mt-3"); 
    monthButtonHighlight(monthButtonSelect, monthChosenIndex);
  }
  monthChosenNumber = monthChosenIndex + 1;

  daysArray = [];
  getDaysArrayByMonth(currentYear, monthChosenNumber);
  // Creating the day buttons and appending it all to the day article
  for (i = 0; i < daysArray.length; i++) {
    var dayValue = daysArray[i];
    var dayButton = document.createElement("button");
    dayButton.setAttribute("class", "day button is-link is-outlined mx-1 mt-3");
    dayButton.setAttribute("data-day", dayValue);
    dayButton.textContent = dayValue;
    dayButton.addEventListener("click", dateSelected)
    dayArticle.append(dayButton);
  }
  // When the user selects a month, only the dates for that month will be shown - the dates for the previous month selected will be removed i.e. the number of buttons will equal the number of days in the month selected
  var dayButtonSelect = appointmentDateSection.querySelectorAll(".day");
  formattedMonth = ("0" + monthChosenNumber).slice(-2);
  var numberOfDaysInMonthChosen = moment(currentYear + "-" + formattedMonth).daysInMonth();
  numberOfElementsShown(dayButtonSelect, numberOfDaysInMonthChosen);
}

// Once the day is selected, an option to add the time will be displayed
function dateSelected() {
  dateChosen = this.getAttribute("data-day");
  var dayChosenIndex = daysArray.indexOf(dateChosen);
  var dayButtonSelect = appointmentDateSection.querySelectorAll(".day");
  // Changing the selected day button colour when clicked
  for (i = 0; i < daysArray.length; i++) {
    dayButtonSelect[i].setAttribute("class", "day button is-link is-outlined mx-1 mt-3");
    dayButtonSelect[dayChosenIndex].setAttribute("class", "day button is-8 is-warning mx-1 mt-3"); 
  }

  var hourButton, pItem;
  hourArticle.setAttribute("class", "appointment-hour has-text-centered is-block mb-3");

  pItem = document.createElement("p");
  pItem.textContent ="Hour:";
  pItem.setAttribute('class', 'has-text-weight-semibold');
  hourArticle.append(pItem);
  // Creating the hour buttons and appending it all to the hour article
  for(i = 0; i < hoursArray.length; i++) {
      hourButton = document.createElement("button");
      hourButton.setAttribute("class", "hour button is-link mx-1 mt-3");
      hourButton.setAttribute("data-hour", hoursArray[i]);
      hourButton.setAttribute("id", hoursArray[i]);
      hourButton.textContent =  hoursArray[i];
      hourButton.addEventListener("click", hourSelected);
      hourArticle.append(hourButton);
  }
  var hourButtonSelect = appointmentDateSection.querySelectorAll(".hour");
  var hourParagraphSelect = hourArticle.querySelectorAll("p");
  // Preventing the hour button and hour paragraph elements from being duplicated when the day is clicked on again by the user
  numberOfElementsShown(hourButtonSelect, 16);
  numberOfElementsShown(hourParagraphSelect, 1);
}

function hourSelected() {
  var hourButtonSelect, minutesSection, minutesSectionExists, pItem

  hourChosen = this.getAttribute("data-hour"); 
  var hourChosenIndex = hoursArray.indexOf(hourChosen);
  var hourButtonSelect = hourArticle.querySelectorAll(".hour");
  // Changing the selected hour button colour when clicked
  for (i = 0; i < hoursArray.length; i++) {
    hourButtonSelect[i].setAttribute("class", "hour button is-link mx-1 mt-3");
    hourButtonSelect[hourChosenIndex].setAttribute("class", "hour hourSelected button is-8 is-warning mx-1 mt-3"); 
  }

  minutesSection = document.querySelector(".appointment-minute");
  // need to empty minute data
  if (minutesSection != null ){
      minutesSectionExists = minutesSection.querySelectorAll(".minute");
      numberOfElementsShown(minutesSectionExists, 0);

      minutesSectionExists = minutesSection.querySelectorAll("p");
      numberOfElementsShown(minutesSectionExists, 0);
  }
  minuteArticle.setAttribute("class", "appointment-minute has-text-centered is-block mb-5");

  pItem = document.createElement("p");
  pItem.setAttribute('class', 'has-text-weight-semibold');
  pItem.textContent ="Minutes:";
  minuteArticle.append(pItem);
  // Creating the minute buttons and appending it all to the minute article
  for (i=0; i <minutesArray.length; i++) {
      minuteButton = document.createElement("button");
      minuteButton.setAttribute("class", "minute button is-link mx-1 mt-3");
      minuteButton.setAttribute("data-minute", minutesArray[i]);
      minuteButton.setAttribute("id", minutesArray[i]);
      minuteButton.textContent = minutesArray[i];
      minuteButton.addEventListener("click", minuteSelected);
      minuteArticle.append(minuteButton);
  }
}

function minuteSelected() {
  console.log("inside minuteSelected");
  minuteChosen = this.getAttribute("data-minute"); 
  console.log("minute chosen", minuteChosen);

  hourChosen = document.querySelector(".hourSelected").getAttribute("data-hour");

  // Need to reset the minute selected in case user changes seletected minutes
  var minuteButtonSelect = minuteArticle.querySelectorAll("button");
  for (i=0; i< minutesArray.length; i++){
      minuteButtonSelect[i].setAttribute("class", "minute button is-link mx-1 mt-3");
  }
  this.setAttribute("class", "minute minuteSelected is-8 button is-warning mx-1 mt-3"); 

  var dateParagraph = document.createElement("p");
  dateParagraph.setAttribute("class", "chosen-appointment-date");

  appointmentStartTime = hourChosen + ":" + minuteChosen;
  appointmentDate = dateChosen + " " + monthChosen + ' ' + currentYear;

  // When the user selects a date, only the latest date paragraph will be shown - the previous one will be removed
  var dateParagraphClassSelect = document.querySelectorAll(".chosen-appointment-date");
  numberOfElementsShown(dateParagraphClassSelect, 0);

  var monthChosenIndex = monthsArray.indexOf(monthChosen);
  monthChosenNumber = monthChosenIndex + 1;
  formattedDate = currentYear + formattedMonth + dateChosen; 
  dayOfWeek = moment(currentYear + "-" + monthChosenNumber + "-" + dateChosen, "YYYY-MM-DD").format("dddd");
  dateParagraph.innerHTML = `<span class="has-text-weight-semibold">Appointment Date:</span> ${dayOfWeek}, ${dateChosen} ${monthChosen} ${currentYear} at ${appointmentStartTime}`;
  dateParagraphContainer.append(dateParagraph);
  
  nextButtonCreate();
  var nextButtonSelect = document.querySelector(".next");
  nextButtonSelect.addEventListener("click", secondStepAppointmentDetails);
}

// The next button will appear when the user has selected a date for their appointment entry
function nextButtonCreate() {
  var nextButton = document.createElement("button");
  nextButton.setAttribute("class", "next button is-success is-right mt-3 px-5");
  nextButton.setAttribute("style", "margin-left: 75%; width: 25%;");
  nextButton.textContent = "Next";
  appointmentDateSection.append(nextButton);
  // Preventing the next button from duplicating
  var nextButtonSelect = document.querySelectorAll(".next");
  numberOfElementsShown(nextButtonSelect, 1);
}

/* FUNCTION FOR THE SECOND STEP IN THE CREATE APPOINTMENT PROCESS */
function secondStepAppointmentDetails() {
  appointmentDateSection.setAttribute("class", "is-hidden");
  appointmentDetailsSection.setAttribute("class", "appointment-details box is-block mx-3");
  var submitAppointmentEntryButton = document.querySelector(".submit-appointment");
  submitAppointmentEntryButton.addEventListener("click",createAppointmentEntry);
}

function createAppointmentEntry(event) {
  event.preventDefault();
  userNameInput = document.getElementById("username-input");
  appointmentForInput = document.getElementById("appointment-name-input");
  appointmentWithInput = document.getElementById("person-appointment-with");
  addressInput = document.getElementById("appointment-location");

  userName = userNameInput.value;
  appointmentWhom = appointmentForInput.value;
  appointmentWith = appointmentWithInput.value;
  appointmentAddress = addressInput.value;

  if(userNameInput && userName && appointmentForInput && appointmentWhom && appointmentWithInput && appointmentWith && addressInput && appointmentAddress) {
    var newAppointmentDetails = {
        name: userName,
        appointmentDate: appointmentDate,
        appointmentStartTime: appointmentStartTime,
        appointmentWhom: appointmentWhom,
        appointmentWith: appointmentWith,
        appointmentAddress: appointmentAddress
    }
    appointmentDetails.push(newAppointmentDetails);
    saveAppointmentDetails();
    onLoad();
    if(userName && appointmentDate && appointmentStartTime && appointmentWhom && appointmentWith && appointmentAddress) {
        addNewAppointment();
        var ifNoAppointments = document.getElementById("no-appointments");
        if(ifNoAppointments) {
            ifNoAppointments.parentNode.remove();
        }
    }
  }
}

function addNewAppointment() {
  var appointmentCard = document.createElement("div");
  appointmentCard.setAttribute("class", "card");

  var appointmentCardContent = document.createElement("div");
  appointmentCardContent.setAttribute("class", "card-content");

  var appointmentContent = document.createElement("div");
  appointmentContent.setAttribute("class", "content");

  var appointmentCardData = `
  <p class="my-3"><span class="has-text-weight-semibold">Username:</span> ${userName}</p>
  <p class="my-3"><span class="has-text-weight-semibold">Appointment Date:</span> ${appointmentDate}</p>
  <p class="my-3"><span class="has-text-weight-semibold">Appointment Time:</span> ${appointmentStartTime}</p>
  <p class="my-3"><span class="has-text-weight-semibold">For Whom:</span> ${appointmentWhom}</p>
  <p class="my-3"><span class="has-text-weight-semibold">Appointment With:</span> ${appointmentWith}</p>
  <p class="my-3"><span class="has-text-weight-semibold">Address:</span> ${appointmentAddress}</p>
  `;
  appointmentContent.innerHTML = appointmentCardData;
  appointmentCard.append(appointmentCardContent, appointmentContent);
  appointmentContainer.append(appointmentCard);
}

function renderAppointments() {
  appointmentCardSection.setAttribute("class", "appointment-cards is-block mx-3");

  appointmentDetails.forEach(function(appointmentDetails) {
    var appointmentCard = document.createElement("div");
    appointmentCard.setAttribute("class", "card");

    var appointmentCardContent = document.createElement("div");
    appointmentCardContent.setAttribute("class", "card-content");

    var appointmentContent = document.createElement("div");
    appointmentContent.setAttribute("class", "content");

    var appointmentCardData = `
    <p class="my-3"><span class="has-text-weight-semibold">Username:</span> ${appointmentDetails.name}</p>
    <p class="my-3"><span class="has-text-weight-semibold">Appointment Date:</span> ${appointmentDetails.appointmentDate}</p>
    <p class="my-3"><span class="has-text-weight-semibold">Appointment Time:</span> ${appointmentDetails.appointmentStartTime}</p>
    <p class="my-3"><span class="has-text-weight-semibold">For Whom:</span> ${appointmentDetails.appointmentWhom}</p>
    <p class="my-3"><span class="has-text-weight-semibold">Appointment With:</span> ${appointmentDetails.appointmentWith}</p>
    <p class="my-3"><span class="has-text-weight-semibold">Address:</span> ${appointmentDetails.appointmentAddress}</p>
    `;
    appointmentContent.innerHTML = appointmentCardData;
    appointmentCard.append(appointmentCardContent, appointmentContent);
    appointmentContainer.append(appointmentCard);
  })

  if (appointmentDetails.length < 1) {
    var appointmentCardData = `
       <h4 id="no-appointments">No appointments have been currently saved.</h4>
    `;
    var appointmentCard = document.createElement("div");
    appointmentCard.setAttribute("class", "box");
    appointmentCard.innerHTML = appointmentCardData;
    appointmentContainer.append(appointmentCard);  
  }
}

function getDaysArrayByMonth(year, month) {
  formattedMonth = ("0" + month).slice(-2);
  var daysInMonth = moment(year + "-" + formattedMonth).daysInMonth();
  while (daysInMonth) {
    var monthUsed = moment(year + "-" + formattedMonth).date(daysInMonth);
    var dayNumber = monthUsed.format("D");
    daysArray.push(dayNumber);
    daysInMonth--;
  }
  daysArray.sort(function (a, b) {
    return a - b;
  });
}

// When the user selects a month/date, only the latest article will be shown - the previous one will be removed
function numberOfElementsShown(elementSelect, numberOfElements) {
  if (elementSelect.length > numberOfElements) {
    for (i = 0; i < elementSelect.length - numberOfElements; i++) {
      elementSelect[i].remove();
    }
  }
}

// Function to highlight the button of the current month
function monthButtonHighlight(monthButtonSelect, monthIndex) {
  monthButtonSelect[monthIndex].setAttribute("class", "month is-8 button is-warning mx-1 mt-3"); 
}

// Click event attached to the Create Appointment Entry button
appointmentEntryButton.addEventListener('click', startEntry);

// Function to run when the webpage loads - user will see the Create Appointment Entry button on the top of the page below the header
function onLoad() {
  appointmentEntrySection.setAttribute("class", "create-appointment-entry has-text-centered mb-5 p-4");
  appointmentEntryButton.setAttribute("class", "create-appointment-entry-button button is-link is-size-4 my-5 p-5");
  appointmentDateSection.setAttribute("class", "is-hidden");
  appointmentDetailsSection.setAttribute('class', 'is-hidden');
  //appointmentCardSection.setAttribute('class', 'is-hidden');
  mainSection.setAttribute("style", "margin-top: 2rem; margin-bottom: 2rem; min-height: 87vh;");
  // On page load, user view is scrolled to the top of the web page
  setTimeout(function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
  }, 400);
}
loadAppointmentDetails();
onLoad();
