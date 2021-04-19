// VARIABLES
var body = document.querySelector("body");
var mainSection = document.querySelector("main");
var appointmentEntrySection = document.querySelector(
  ".create-appointment-entry"
);
var appointmentEntryButton = document.querySelector(
  ".create-appointment-entry-button"
);
var appointmentDateSection = document.querySelector(".appointment-date");
var appointmentDetailsSection = document.querySelector(".appointment-details");

var dayArticle = document.querySelector(".days");
var hourArticle = document.querySelector(".appointment-hour");
var minuteArticle = document.querySelector(".appointment-minute");
var monthArticle = document.querySelector(".months");

var dateParagraphContainer = document.querySelector(".date-description");
var appointmentCardSection = document.querySelector(".appointment-cards");
var appointmentColumns = document.querySelector(".card-columns");

// Using moment.js for the dates - year, month and day
var m = moment();
var currentDate = m.format("D");
var currentHour = m.format("HH");
var currentMinute = m.format("mm");
var currentMonth = m.format("MMMM");
var currentMonthNumber = m.format("MM");
var currentYear = m.format("YYYY");

var monthsArray = moment.months();
var daysArray = [];
var hoursArray = [
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];
var minutesArray = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
var appointmentDate,
  appointmentStartTime,
  appointmentWith,
  appointmentWhom,
  appointmentAddress,
  currentMonthIndex,
  dayOfWeek,
  dateChosen,
  formattedDate,
  formattedMonth,
  monthChosen,
  userName;

currentMonthIndex = monthsArray.indexOf(currentMonth);
appointmentDetails = [];

// Function flow of EATen code
//loadAppointmentDetails--> onLoad -->startEntry -->monthSelected -->dateSelected -->hourSelectd -->minuteSelected -->
// setupAppointmentEntry -->createAppointmentEntry -->addNewAppointment-->

function saveAppointmentDetails() {
  localStorage.setItem(
    "myAppointmentDetails",
    JSON.stringify(appointmentDetails)
  );
}

function loadAppointmentDetails() {
  var storedAppointmentDetails = JSON.parse(localStorage.getItem("myAppointmentDetails"));
  if (storedAppointmentDetails !== null) {
    appointmentDetails = storedAppointmentDetails;
  }
  renderAppointments();
}

// When the Create Appointment Entry Button is clicked, a list of months will be displayed
function startEntry() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  appointmentEntrySection.setAttribute("class", "is-hidden");
  appointmentDateSection.setAttribute(
    "class",
    "appointment-date box is-block mx-3"
  );

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
  // Need to check that if there are any hours or minutes that these are cleared if and when the user changes the month
  var dayButtonSelect = appointmentDateSection.querySelectorAll(".day");
  numberOfElementsShown(dayButtonSelect, 0);

  var hourButtonSelect = appointmentDateSection.querySelectorAll(".hour");
  numberOfElementsShown(hourButtonSelect, 0);

  // var hourParagraphSelect = hourArticle.querySelectorAll("p");
  // numberOfElementsShown(hourParagraphSelect, 0);

  var minutesSectionExists = appointmentDateSection.querySelectorAll(".minute");
  numberOfElementsShown(minutesSectionExists, 0);

  var minutesSectionExists = appointmentDateSection.querySelectorAll("p");
  numberOfElementsShown(minutesSectionExists, 0);

  var buttonSelect = appointmentDateSection.querySelectorAll(".next");
  numberOfElementsShown(buttonSelect, 0);

  // Changing the selected month button colour when clicked
  var monthChosenIndex = monthsArray.indexOf(monthChosen);
  var monthArticle = document.querySelector(".months");
  var monthButtonSelect = monthArticle.querySelectorAll("button");
  for (i = 0; i < monthsArray.length; i++) {
    monthButtonSelect[i].setAttribute(
      "class",
      "month button is-link mx-1 mt-3"
    );
    monthButtonSelect[currentMonthIndex].setAttribute(
      "class",
      "month button is-link mx-1 mt-3"
    );
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
    dayButton.addEventListener("click", dateSelected);
    dayArticle.append(dayButton);
  }

  var dayButtonSelect = appointmentDateSection.querySelectorAll(".day");
  // Get the current day and disable those days in the past
  if (currentMonthIndex === monthChosenIndex) {
    for (i = 0; i < daysArray.length; i++) {
      if (daysArray[i] < Number(currentDate)) {
        dayButtonSelect[i].setAttribute("disabled", "");
      }
    }
  }

  // When the user selects a month, only the dates for that month will be shown - the dates for the previous month selected will be removed i.e. the number of buttons will equal the number of days in the month selected
  formattedMonth = ("0" + monthChosenNumber).slice(-2);
  var numberOfDaysInMonthChosen = moment(
    currentYear + "-" + formattedMonth
  ).daysInMonth();
  numberOfElementsShown(dayButtonSelect, numberOfDaysInMonthChosen);
}

// Once the day is selected, an option to add the time will be displayed
function dateSelected() {
  dateChosen = this.getAttribute("data-day");
  var hourButton, pItem;
  // Ensure Minutes are cleared from any previous months
  var minutesSectionExists = appointmentDateSection.querySelectorAll(".minute");
  numberOfElementsShown(minutesSectionExists, 0);

  var minutesSectionExists = appointmentDateSection.querySelectorAll("p");
  numberOfElementsShown(minutesSectionExists, 0);

  var dayChosenIndex = daysArray.indexOf(dateChosen);
  var dayButtonSelect = appointmentDateSection.querySelectorAll(".day");
  // Changing the selected day button colour when clicked
  for (i = 0; i < daysArray.length; i++) {
    dayButtonSelect[i].setAttribute(
      "class",
      "day button is-link is-outlined mx-1 mt-3"
    );
    dayButtonSelect[dayChosenIndex].setAttribute(
      "class",
      "day button is-8 is-warning mx-1 mt-3"
    );
  }

  hourArticle.setAttribute(
    "class",
    "appointment-hour has-text-centered is-block mb-3"
  );

  pItem = document.createElement("p");
  pItem.textContent = "Hour:";
  pItem.setAttribute("class", "has-text-weight-semibold");
  hourArticle.append(pItem);

  // Creating the hour buttons and appending it all to the hour article
  for (i = 0; i < hoursArray.length; i++) {
    hourButton = document.createElement("button");
    hourButton.setAttribute("class", "hour button is-link mx-1 mt-3");
    hourButton.setAttribute("data-hour", hoursArray[i]);
    hourButton.setAttribute("id", hoursArray[i]);
    hourButton.textContent = hoursArray[i];
    hourButton.addEventListener("click", hourSelected);
    hourArticle.append(hourButton);
  }

  // Preventing the hour button and hour paragraph elements from being duplicated when the day is clicked on again by the user
  var hourButtonSelect = appointmentDateSection.querySelectorAll(".hour");
  numberOfElementsShown(hourButtonSelect, 16);

  var hourParagraphSelect = hourArticle.querySelectorAll("p");
  numberOfElementsShown(hourParagraphSelect, 1);

  if (currentMonthIndex === monthsArray.indexOf(monthChosen)) {
    var hourButtonSelect = appointmentDateSection.querySelectorAll(".hour");
    if (dateChosen === currentDate) {
      //Get the current hour and disable those hours in the past
      for (i = 0; i < hoursArray.length; i++) {
        if (hoursArray[i] < Number(currentHour)) {
          hourButtonSelect[i].setAttribute("disabled", "");
        }
      }
    }
  }
}

function hourSelected() {
  var hourButtonSelect, minutesSection, minutesSectionExists, pItem;

  hourChosen = this.getAttribute("data-hour");
  var hourChosenIndex = hoursArray.indexOf(hourChosen);
  var hourButtonSelect = hourArticle.querySelectorAll(".hour");
  // Changing the selected hour button colour when clicked
  for (i = 0; i < hoursArray.length; i++) {
    hourButtonSelect[i].setAttribute("class", "hour button is-link mx-1 mt-3");
    hourButtonSelect[hourChosenIndex].setAttribute(
      "class",
      "hour hourSelected button is-8 is-warning mx-1 mt-3"
    );
  }

  minutesSection = document.querySelector(".appointment-minute");
  // need to empty minute data
  minutesSectionExists = minutesSection.querySelectorAll(".minute");
  numberOfElementsShown(minutesSectionExists, 0);

  minutesSectionExists = minutesSection.querySelectorAll("p");
  numberOfElementsShown(minutesSectionExists, 0);

  minuteArticle.setAttribute(
    "class",
    "appointment-minute has-text-centered is-block mb-5"
  );

  pItem = document.createElement("p");
  pItem.setAttribute("class", "has-text-weight-semibold");
  pItem.textContent = "Minutes:";
  minuteArticle.append(pItem);
  // Creating the minute buttons and appending it all to the minute article
  for (i = 0; i < minutesArray.length; i++) {
    minuteButton = document.createElement("button");
    minuteButton.setAttribute("class", "minute button is-link mx-1 mt-3");
    minuteButton.setAttribute("data-minute", minutesArray[i]);
    minuteButton.setAttribute("id", minutesArray[i]);
    minuteButton.textContent = minutesArray[i];
    minuteButton.addEventListener("click", minuteSelected);
    minuteArticle.append(minuteButton);
  }
  var minuteButtonSelect = appointmentDateSection.querySelectorAll(".minute");

  if (currentMonthIndex === monthsArray.indexOf(monthChosen)) {
    //Get the current minute and disable those minutes in the past
    if (currentHour > "07" && hourChosen === currentHour) {
      for (i = 0; i < minutesArray.length; i++) {
        if (minutesArray[i] < Number(currentMinute)) {
          minuteButtonSelect[i].setAttribute("disabled", "");
        }
      }
    }
  }
}

function minuteSelected() {
  hourChosen = document
    .querySelector(".hourSelected")
    .getAttribute("data-hour");

  // Need to reset the minute selected in case user changes seletected minutes
  var minuteButtonSelect = minuteArticle.querySelectorAll("button");
  for (i = 0; i < minutesArray.length; i++) {
    minuteChosen = this.getAttribute("data-minute");

    minuteButtonSelect[i].setAttribute(
      "class",
      "minute button is-link mx-1 mt-3"
    );

    this.setAttribute(
      "class",
      "minute minuteSelected is-8 button is-warning mx-1 mt-3"
    );
  }

  var dateParagraph = document.createElement("p");
  dateParagraph.setAttribute("class", "chosen-appointment-date");

  appointmentStartTime = hourChosen + ":" + minuteChosen;
  appointmentDate = dateChosen + " " + monthChosen + " " + currentYear;

  // When the user selects a date, only the latest date paragraph will be shown - the previous one will be removed
  var dateParagraphClassSelect = document.querySelectorAll(
    ".chosen-appointment-date"
  );
  numberOfElementsShown(dateParagraphClassSelect, 0);

  var monthChosenIndex = monthsArray.indexOf(monthChosen);
  monthChosenNumber = monthChosenIndex + 1;
  formattedDate = currentYear + formattedMonth + dateChosen;
  dayOfWeek = moment(
    currentYear + "-" + monthChosenNumber + "-" + dateChosen,
    "YYYY-MM-DD"
  ).format("dddd");
  dateParagraph.innerHTML = `<span class="has-text-weight-semibold">Appointment Date:</span> ${dayOfWeek}, ${dateChosen} ${monthChosen} ${currentYear} at ${appointmentStartTime}`;
  dateParagraphContainer.append(dateParagraph);

  nextButtonCreate();
  var nextButtonSelect = document.querySelector(".next");
  nextButtonSelect.addEventListener("click", setupAppointmentEntry);
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
function setupAppointmentEntry() {
  appointmentDateSection.setAttribute("class", "is-hidden");
  appointmentDetailsSection.setAttribute(
    "class",
    "appointment-details box is-block mx-3"
  );
  var submitAppointmentEntryButton = document.querySelector(
    ".submit-appointment"
  );
  submitAppointmentEntryButton.addEventListener(
    "click",
    createAppointmentEntry
  );
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

  if (userNameInput && userName && appointmentForInput && appointmentWhom && appointmentWithInput && appointmentWith && addressInput && appointmentAddress) {
    var newAppointmentDetails = {
      name: userName,
      appointmentDate: appointmentDate,
      appointmentStartTime: appointmentStartTime,
      appointmentWhom: appointmentWhom,
      appointmentWith: appointmentWith,
      appointmentAddress: appointmentAddress,
    };
    appointmentDetails.push(newAppointmentDetails);
    saveAppointmentDetails();
    onLoad();
    if (userName && appointmentDate && appointmentStartTime && appointmentWhom && appointmentWith && appointmentAddress) {
      renderAppointments();
      var ifNoAppointments = document.getElementById("no-appointments");
      if (ifNoAppointments) {
        ifNoAppointments.parentNode.remove();
      }
    }
  } else {
    var errorMessage = document.querySelectorAll(".error");
    numberOfElementsShown(errorMessage, 0);
    var errorMessageText = "Enter details for ";
    if (!userName) {
      errorMessageText = errorMessageText + "Name, ";
    }
    if (!appointmentWhom) {
      errorMessageText = errorMessageText + "Who the Appointment is for, ";
    }
    if (!appointmentWith) {
      errorMessageText = errorMessageText + "Who the Appointment is with, ";
    }
    if (!appointmentAddress) {
      errorMessageText = errorMessageText + "the address of the Appointment";
    }

    errorMessageText = errorMessageText.replace(/,\s*$/, "");

    var pItem = document.createElement("p");
    pItem.textContent = errorMessageText;
    pItem.setAttribute("class", "error notification is-danger");
    appointmentDetailsSection.append(pItem);
  }
}

function addAppointment(appointmentDate, appointmentStartTime, appointmentWith, appointmentWhom, appointmentAddress) {
  //Create a column for each card
  var appointmentColumn = document.createElement("div");
  appointmentColumn.setAttribute("class", "column is-one-fifth card-columns-nested");
  
  //Create Card
  var appointmentCard = document.createElement("div");
  appointmentCard.setAttribute("class", "card");
  
  //Card Header and content
  var appointmentCardHeader = document.createElement("div");
  appointmentCardHeader.setAttribute("class", "card-header");
  var appointmentCardHeaderContent = document.createElement("div");
  appointmentCardHeaderContent.setAttribute("class", "card-header-title");
  var appointmentCardContent = document.createElement("div");
  appointmentCardContent.setAttribute("class", "card-content");  
  // Access Appointment Date and Start time for Header Content
  var appointmentHeaderData = `
    <p class="my-3"><span class="has-text-weight-semibold">${appointmentDate}</span></p>
    <p class="my-3"><span class="has-text-weight-semibold">At : </span>${appointmentStartTime}</p>
  `;
  //Pull from arrays for Card Content
  var appointmentCardData = `
    <p class="my-3"><span class="has-text-weight-semibold">With:</span> ${appointmentWith}</p>
    <p class="my-3"><span class="has-text-weight-semibold">For Whom:</span> ${appointmentWhom}</p>
    <p class="my-3"><span class="has-text-weight-semibold">Address:</span> ${appointmentAddress}</p>
  `;
  //Create a card footer with edit and delete buttons
  var cardFooter = document.createElement("footer");
  cardFooter.setAttribute("class", "card-footer");
  editButton = document.createElement("button");
  editButton.setAttribute("class", "card-footer-item edit-btn");
  editButton.textContent = "Edit";
  deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "card-footer-item delete-btn");
  deleteButton.textContent = "Delete";

  //Append items to page dynamically
  appointmentCardHeaderContent.innerHTML = appointmentHeaderData;
  appointmentCardContent.innerHTML = appointmentCardData;
  appointmentColumns.append(appointmentColumn);
  appointmentCard.append(
    appointmentCardHeader,
    appointmentCardContent,
    cardFooter
  );
  appointmentCardHeader.append(appointmentCardHeaderContent);
  appointmentColumn.append(appointmentCard);
  cardFooter.append(editButton, deleteButton);
}

function renderAppointments() {
  appointmentCardSection.setAttribute("class", "appointment-cards is-block mx-3");
  appointmentDetailsSort = appointmentDetails.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  appointmentColumns.innerHTML = "";
  for (let i = 0; i < appointmentDetails.length; i++) {
    addAppointment(appointmentDetails[i].appointmentDate, appointmentDetails[i].appointmentStartTime, appointmentDetails[i].appointmentWith, appointmentDetails[i].appointmentWhom, appointmentDetails[i].appointmentAddress);
    deleteButton.setAttribute("data-appointment-index", i);
  }
  if (appointmentDetails.length < 1) {
    var appointmentCardData = `
       <h4 id="no-appointments">No appointments have been currently saved.</h4>
    `;
    var appointmentCard = document.createElement("div");
    appointmentCard.setAttribute("class", "box");
    appointmentCard.innerHTML = appointmentCardData;
    appointmentColumns.append(appointmentCard);
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

// Function to delete the appointment when the delete button is clicked
function deleteAppointment(event) {
  var element = event.target;
  console.log(element);
  if (element.matches(".delete-btn") === true) {
    console.log("delete button clicked");
    var index = element.getAttribute("data-appointment-index");
    appointmentDetails.splice(index, 1);
    saveAppointmentDetails();
    renderAppointments();
  } 
}

function deleteClickEvent() {
  deleteButton = document.querySelectorAll(".delete-btn");
  cardContainer = document.querySelector(".card-columns");
  cardContainer.addEventListener("click", deleteAppointment);
}

// Click event attached to the Create Appointment Entry button
appointmentEntryButton.addEventListener("click", startEntry);

// Function to run when the webpage loads - user will see the Create Appointment Entry button on the top of the page below the header
function onLoad() {
  appointmentEntrySection.setAttribute("class", "create-appointment-entry has-text-centered mb-5 p-4");
  appointmentEntryButton.setAttribute("class", "create-appointment-entry-button button is-link is-size-4 my-5 p-5");
  appointmentDateSection.setAttribute("class", "is-hidden");
  appointmentDetailsSection.setAttribute("class", "is-hidden");
  mainSection.setAttribute("style", "margin-top: 2rem; margin-bottom: 2rem; min-height: 87vh;");
  deleteClickEvent()
  // On page load, user view is scrolled to the top of the web page
  setTimeout(function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 400);
}
loadAppointmentDetails();
onLoad();



