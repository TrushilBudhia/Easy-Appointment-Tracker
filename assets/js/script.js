// VARIABLES
var body = document.querySelector('body');
var headerSection = document.querySelector('header');
var mainSection = document.querySelector('main');
var appointmentEntrySection = document.querySelector('.create-appointment-entry');
var appointmentEntryButton = document.querySelector('.create-appointment-entry-button');
var appointmentDateSection = document.querySelector('.appointment-date');
var monthArticle = document.querySelector('.months');
var dayArticle = document.querySelector('.days');
var timeArticle = document.querySelector('.appointment-time');
var appointmentDetailsSection = document.querySelector('.appointment-details');
var dateParagraphContainer = document.querySelector('.date-description');
var appointmentCardSection = document.querySelector('.appointment-cards');
// Using moment.js for the dates - year, month and day  
var m = moment();
var currentYear = m.format('YYYY');
var currentMonth = m.format('MMMM');
var currentMonthNumber = m.format('MM');
var currentDate = m.format('D');
var monthsArray = moment.months();
var daysArray = [];
var dayOfWeek, dateChosen, monthChosen, userName, appointmentDate, appointmentStartTime, appointmentWith, appointmentWhom, appointmentAddress, formattedDate, formattedMonth;
var currentMonthIndex = monthsArray.indexOf(currentMonth);

console.log(currentDate, currentMonth, currentYear);

saveAppointmentDetails('Susanne', '20210428', '08:00', 'self', 'Doctor', '12 Smith Street, Perth, WA');

function saveAppointmentDetails(userName, appointmentDate, appointmentStartTime, appointmentWhom, appointmentWith, appointmentAddress){

  appointmentDetails = [];
  
  var newAppointmentDetails = {
      name: '',
      appointmentDate: '',
      appointmentStartTime: '',
      appointmentWhom:'',
      appointmentWith:'',
      appointmentAddress:''
  }

  newAppointmentDetails.name = userName;
  newAppointmentDetails.appointmentDate = appointmentDate;
  newAppointmentDetails.appointmentStartTime = appointmentStartTime;
  newAppointmentDetails.appointmentWhom = appointmentWhom;
  newAppointmentDetails.appointmentWith = appointmentWith;
  newAppointmentDetails.appointmentAddress = appointmentAddress;

  var oldAppoinmentDetails = JSON.parse(localStorage.getItem("myAppointmentDetails"));
  if (oldAppoinmentDetails !== null) {
    appointmentDetails = Object.values(oldAppoinmentDetails);
    appointmentDetails.push(newAppointmentDetails);
    localStorage.setItem("myAppointmentDetails", JSON.stringify(appointmentDetails));
   }else {
    appointmentDetails.unshift(newAppointmentDetails);
    localStorage.setItem("myAppointmentDetails", JSON.stringify(appointmentDetails))
   }
}


/* FUNCTION FOR THE FIRST STEP IN THE CREATE APPOINTMENT PROCESS */
// When the Create Appointment Entry Button is clicked, a list of months will be displayed
function startEntry() {
    appointmentEntryButton.setAttribute('class', 'is-hidden');
    appointmentDateSection.setAttribute('class', 'is-block box');

    // Creating the month buttons and appending it all to the month article
    for(i = 0; i < monthsArray.length; i++) {
        var monthValue = monthsArray[i];
      
        var monthButton = document.createElement('button');
        monthButton.setAttribute('class', 'month button is-link mx-1 mt-3');
        monthButton.setAttribute('data-month', monthValue);
        monthButton.setAttribute('id', monthValue);
        monthButton.textContent = monthValue;
        monthArticle.append(monthButton);
    }
    var numberOfMonthButtons = appointmentDateSection.querySelectorAll('.month');
    numberOfElementsShown(numberOfMonthButtons, 12);
    // Attaching click event to current and future months in the year. The past month buttons are disabled
    var monthButtonSelect = monthArticle.querySelectorAll('button');
    for(i = currentMonthIndex; i < monthButtonSelect.length; i++) {
        monthButtonSelect[i].addEventListener('click', monthSelected);
    }
    for(i = currentMonthIndex - 1; i > -1; i--) {
        monthButtonSelect[i].setAttribute('title', 'Disabled button');
        monthButtonSelect[i].setAttribute('disabled', '');
    }
    currentMonthHighlight(monthButtonSelect, currentMonthIndex);
}

// Once the month is selected by the user, a list of days for that month will be displayed
function monthSelected() {
    monthChosen = this.getAttribute('data-month'); 
    console.log("Month chosen is " + monthChosen);
    daysArray = [];
    // Changing the selected month button colour when clicked
    var monthChosenIndex = monthsArray.indexOf(monthChosen);
    var monthArticle = document.querySelector('.months');
    var monthButtonSelect = monthArticle.querySelectorAll('button');
    for(i = 0; i < monthsArray.length; i++) {
        monthButtonSelect[i].setAttribute('class', 'month button is-link mx-1 mt-3');
        monthButtonSelect[currentMonthIndex].setAttribute('class', 'month button is-link mx-1 mt-3'); 
        currentMonthHighlight(monthButtonSelect, monthChosenIndex);
    }
    monthChosenNumber = monthChosenIndex + 1;
    getDaysArrayByMonth(currentYear, monthChosenNumber);

    // Creating the day buttons and appending it all to the day article 
    for(i = 0; i < daysArray.length; i++) {
        var dayValue = daysArray[i];
        var dayButton = document.createElement('button');
        dayButton.setAttribute('class', 'day button is-link is-outlined mx-1 mt-3');
        dayButton.setAttribute('data-day', dayValue);
        dayButton.textContent = dayValue;
        dayArticle.append(dayButton);
    }   
    // When the user selects a month, only the dates for that month will be shown - the dates for the previous month selected will be removed i.e. the number of buttons will equal the number of days in the month selected
    var dayButtonsSelect = appointmentDateSection.querySelectorAll('.day');
    formattedMonth = ("0" + monthChosenNumber).slice(-2);
    var numberOfDaysInMonthChosen = moment(currentYear + '-' + formattedMonth).daysInMonth();
    console.log("Number of days in month chosen is " + numberOfDaysInMonthChosen);
    numberOfElementsShown(dayButtonsSelect, numberOfDaysInMonthChosen);

    // Click event added to the days buttons
    var dayButtonSelect = dayArticle.querySelectorAll('button');
    for(i = 0; i < dayButtonSelect.length; i++) {
        dayButtonSelect[i].addEventListener('click', dateSelected);
    }
}

// Once the day is selected, an option to add the time will be displayed
function dateSelected() {
    dateChosen = this.getAttribute('data-day');
    console.log("date chosen is " + dateChosen);
    // Creating the time container with the input field and adding it to the time article HTML
    var timeContainer = `
        <div class='time-container'>
            <label class='mr-2'>Enter time: </label>
            <input class='time-input' placeholder='Enter Appointment Time'>
        </div>
    `;
    timeArticle.innerHTML = timeContainer;

    // When the user selects a date, only the latest time article will be shown - the previous one will be removed
    var appointmentTimeContainerSelect = document.querySelectorAll('.time-container');
    numberOfElementsShown(appointmentTimeContainerSelect, 1);

    var dateParagraph = document.createElement('p');
    dateParagraph.setAttribute('class', 'chosen-appointment-date');
    // When the user selects a date, only the latest date paragraph will be shown - the previous one will be removed
    var dateParagraphClassSelect = document.querySelectorAll('.chosen-appointment-date');
    numberOfElementsShown(dateParagraphClassSelect, 0);

    var monthChosenIndex = monthsArray.indexOf(monthChosen);
    monthChosenNumber = monthChosenIndex + 1;
    formattedDate = currentYear + formattedMonth + dateChosen; 
    dayOfWeek = moment(currentYear + '-' + monthChosenNumber + '-' + dateChosen, 'YYYY-MM-DD').format('dddd');
    dateParagraph.textContent = 'Appointment Date: ' + dayOfWeek + ', ' + dateChosen + ' ' + monthChosen + ' ' + currentYear;
    dateParagraphContainer.append(dateParagraph);
    appointmentDate = dateChosen + ' ' + monthChosen + ' ' + currentYear;

    nextButtonCreate();
    console.log('Next button displayed');
    var nextButtonSelect = document.querySelector('.next');
    nextButtonSelect.addEventListener('click', secondStepAppointmentDetails);
}

// The next button will appear when the user has selected a date for their appointment entry
function nextButtonCreate() {
    var nextButton = document.createElement('button');
    nextButton.setAttribute('class', 'next button is-success is-right mt-3 px-5');
    nextButton.setAttribute('style', 'margin-left: 75%; width: 25%;');
    nextButton.textContent = "Next";
    appointmentDateSection.append(nextButton);

    var nextButtonSelect = document.querySelectorAll('.next');
    numberOfElementsShown(nextButtonSelect, 1); 
}

/* FUNCTION FOR THE SECOND STEP IN THE CREATE APPOINTMENT PROCESS */
function secondStepAppointmentDetails() {
    var timeInputSelect = document.querySelector('.time-input');
    appointmentStartTime = timeInputSelect.value;
    if(timeInputSelect && timeInputSelect.value) {
        appointmentDateSection.setAttribute('class', 'is-hidden');
        appointmentDetailsSection.setAttribute('class', 'is-block box');

        var submitAppointmentEntryButton = document.querySelector('.submit-appointment');
        submitAppointmentEntryButton.addEventListener('click', createAppointmentEntry);
    }
}

function createAppointmentEntry(event) {
    event.preventDefault()
    userNameInput = document.getElementById('username-input');
    appointmentForInput = document.getElementById('appointment-name-input');
    appointmentWithInput = document.getElementById('person-appointment-with');
    addressInput = document.getElementById('appointment-location');

    userName = userNameInput.value;
    appointmentWhom = appointmentForInput.value;
    appointmentWith = appointmentWithInput.value;
    appointmentAddress = addressInput.value;

    if(appointmentForInput && appointmentForInput.value && appointmentWithInput && appointmentWithInput.value && addressInput && addressInput.value) {
        onLoad();
        renderAppointments();
    }
}

function renderAppointments() {
    appointmentCardSection.setAttribute('class', 'appointment-cards is-block');
    var appointmentCardArticle = document.createElement('article');
    appointmentCardArticle.setAttribute('class', 'box');
    var appointmentCardContent = `<h4>Appointment entries will be displayed in this section (Can change this line of text to a heading or delete it)</h4>
    <p class='my-3'><span class='has-text-weight-semibold'>Username:</span> ${userName}</p>
    <p class='my-3'><span class='has-text-weight-semibold'>Appointment Date:</span> ${appointmentDate}</p>
    <p class='my-3'><span class='has-text-weight-semibold'>Appointment Time:</span> ${appointmentStartTime}</p>
    <p class='my-3'><span class='has-text-weight-semibold'>For Whom:</span> ${appointmentWhom}</p>
    <p class='my-3'><span class='has-text-weight-semibold'>Appointment With:</span> ${appointmentWith}</p>
    <p class='my-3'><span class='has-text-weight-semibold'>Address:</span> ${appointmentAddress}</p>
    <p>***********The map of the location (API) will go hear***********</p>
    `;
    appointmentCardArticle.innerHTML = appointmentCardContent;
    appointmentCardSection.append(appointmentCardArticle);
}

function getDaysArrayByMonth(year, month) {
    formattedMonth = ('0' + month).slice(-2);
    var daysInMonth = moment(year + '-' + formattedMonth).daysInMonth();
    while(daysInMonth) {
        var monthUsed = moment(year + '-' + formattedMonth).date(daysInMonth);
        var dayNumber = monthUsed.format('D');
        daysArray.push(dayNumber);
        daysInMonth--;
    }
    daysArray.sort(function(a, b){return a-b});
}

// When the user selects a month/date, only the latest article will be shown - the previous one will be removed
function numberOfElementsShown(elementSelect, numberOfElements) {
    if(elementSelect.length > numberOfElements) {
        for(i = 0; i < (elementSelect.length - numberOfElements); i++) {
            elementSelect[i].remove();
        }
    }
}

// Function to highlight the button of the current month
function currentMonthHighlight(monthButtonSelect, monthIndex) {
    monthButtonSelect[monthIndex].setAttribute('class', 'month is-8 button is-warning mx-1 mt-3'); 
}

// Click event attached to the Create Appointment Entry button
appointmentEntryButton.addEventListener('click', startEntry);

// Function to run when the webpage loads - user will see the Create Appointment Entry button on the top of the page below the header
function onLoad() {
    body.setAttribute('style', 'height: 100vh;');
    appointmentEntrySection.setAttribute('class', 'is-flex is-justify-content-center mb-5');
    appointmentEntryButton.setAttribute('class', 'create-appointment-entry-button button is-link is-size-4 p-5');
    appointmentDateSection.setAttribute('class', 'is-hidden');
    appointmentDetailsSection.setAttribute('class', 'is-hidden');
    appointmentCardSection.setAttribute('class', 'is-hidden');
}
onLoad();