// VARIABLES
var body = document.querySelector('body');
var headerSection = document.querySelector('header');
var mainSection = document.querySelector('main');
var AppointmentEntry = document.querySelector('.create-appointment-entry');
var AppointmentEntryButton = document.querySelector('.create-appointment-entry-button');
var AppointmentDate = document.querySelector('.appointment-date');
var AppointmentDetails = document.querySelector('.appointment-details');
var dateParagraphContainer = document.querySelector('.date-description');

// Using moment.js for the dates - year, month and day
var m = moment();
var currentYear = m.format('YYYY');
var currentMonth = m.format('MMMM');
var currentMonthNumber = m.format('MM');
var currentDate = m.format('D');

var monthsArray = moment.months();
var daysArray = [];
function getDaysArrayByMonth(year, month) {
    var daysInMonth = moment(year + "-" + month).daysInMonth();
    while(daysInMonth) {
        var current = moment(year + "-" + month).date(daysInMonth);
        var dayNumber = current.format('D');
        daysArray.push(dayNumber);
        daysInMonth--;
    }
    daysArray.sort(function(a, b){return a-b});
}

console.log(monthsArray);
console.log(daysArray);
console.log(currentDate, currentMonth, currentYear);
var currentMonthIndex = monthsArray.indexOf(currentMonth);

// When the Create Appointment Entry Button is clicked, a list of months will be displayed
function startEntry() {
    AppointmentEntryButton.setAttribute('class', 'is-hidden');
    AppointmentDate.setAttribute('class', 'is-block box');
    AppointmentDate.setAttribute('style', 'height: ;');
    // Creating the month article and month buttons and appending it all to the month article
    var monthArticle = document.createElement('article');
    monthArticle.setAttribute('class', 'months is-flex is-flex-wrap-wrap is-justify-content-center');
    for(i = 0; i < monthsArray.length; i++) {
        var monthValue = monthsArray[i];
        console.log(monthValue);
        
        var monthButton = document.createElement('button');
        monthButton.setAttribute('class', 'month button is-link mx-1 mt-3');
        monthButton.setAttribute('data-month', monthValue);
        monthButton.setAttribute('id', monthValue);
        monthButton.textContent = monthValue;
        monthArticle.append(monthButton);
    }
    AppointmentDate.insertBefore(monthArticle, dateParagraphContainer);

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
var monthChosen;
function monthSelected() {
    monthChosen = this.getAttribute('data-month'); 
    console.log("Month chosen is " + monthChosen);
    daysArray = [];
    // Changing the selected month button colour when clicked
    var monthChosenIndex = monthsArray.indexOf(monthChosen);
    console.log(monthChosenIndex);
    var monthArticle = document.querySelector('.months');
    var monthButtonSelect = monthArticle.querySelectorAll('button');
    for(i = 0; i < monthsArray.length; i++) {
        monthButtonSelect[i].setAttribute('class', 'month button is-link mx-1 mt-3');
        monthButtonSelect[currentMonthIndex].setAttribute('class', 'month button is-link mx-1 mt-3'); 
        currentMonthHighlight(monthButtonSelect, monthChosenIndex);
    }
    monthChosenNumber = monthChosenIndex + 1;
    getDaysArrayByMonth(currentYear, monthChosenNumber);
    console.log(daysArray);

    // Creating the day article and day buttons and appending it all to the day article 
    var dayArticle = document.createElement('article');
    dayArticle.setAttribute('class', 'days is-flex is-flex-wrap-wrap is-justify-content-center column is-10 is-offset-1');
    for(i = 0; i < daysArray.length; i++) {
        var dayValue = daysArray[i];
        var dayButton = document.createElement('button');
        dayButton.setAttribute('class', 'day button is-link is-outlined mx-1 mt-3');
        dayButton.setAttribute('data-day', dayValue);
        dayButton.textContent = dayValue;
        dayArticle.append(dayButton);
    }
    AppointmentDate.insertBefore(dayArticle, dateParagraphContainer);
    
    // If the user changes their mind and selects a different month, the previous list of days article will be removed and only the new month days will be displayed
    var numberOfDayArticles = AppointmentDate.querySelectorAll('.days');
    if(numberOfDayArticles.length > 1) {
        numberOfDayArticles[0].remove();
    }

    // Click event added to the days buttons
    var dayButtonSelect = dayArticle.querySelectorAll('button');
    for(i = 0; i < dayButtonSelect.length; i++) {
        dayButtonSelect[i].addEventListener('click', daySelected);
    }
}

// Once the day is selected, an option to add the time will be displayed
function daySelected() {
    dayChosen = this.getAttribute('data-day');
    console.log("date chosen is " + dayChosen);

    var dateParagraph = document.createElement('paragraph');
    dateParagraph.setAttribute('class', 'chosen-appointment-date');

    var dateParagraphSelect = document.querySelectorAll('.chosen-appointment-date');
    if(dateParagraphSelect.length > 0) {
        dateParagraphSelect[0].remove();
    }
    dayOfWeek = moment().format('dddd');
    dateParagraph.textContent = "Appointment Date: " + dayOfWeek + ", " + dayChosen + " " + monthChosen + " " + currentYear;

    dateParagraphContainer.append(dateParagraph);
}

// Function to highlight the button of the current month
function currentMonthHighlight(monthButtonSelect, monthIndex) {
    monthButtonSelect[monthIndex].setAttribute('class', 'month button is-warning mx-1 mt-3'); 
}

// Click event attached to the Create Appointment Entry button
AppointmentEntryButton.addEventListener('click', startEntry);

// Function to run when the webpage loads - user will see the Create Appointment Entry button on the top of the page below the header
function onLoad() {
    body.setAttribute('style', 'height: 100vh;');
    AppointmentEntry.setAttribute('class', 'is-flex is-justify-content-center mb-5');
    //AppointmentDate.setAttribute('style', 'display: none;');
    AppointmentDate.setAttribute('class', 'is-hidden');
    //AppointmentDetails.setAttribute('style', 'display: none;');
    AppointmentDetails.setAttribute('class', 'is-hidden');
}
onLoad();