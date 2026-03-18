import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (selectedDates[0] <= Date.now()) {
      buttonStart.disabled = true;
      iziToast.error({
        backgroundColor: '#EF4040',
        iconUrl: 'img/error.svg',
        message: 'Please choose a date in the future',
      });
    } else {
      buttonStart.disabled = false;
      userSelectedDate = selectedDates[0];
      iziToast.destroy();
    }
  },
};

iziToast.settings({
  position: 'topRight',
  iconColor: '#fff',
  messageColor: '#fff',
});

const calendar = flatpickr('#datetime-picker', flatpickrOptions);

let userSelectedDate;
let intervalID;
let sec = 1000;

const timer = document.querySelector('.timer');
const fieldDays = timer.children[0].firstElementChild;
const fieldHours = timer.children[1].firstElementChild;
const fieldMinutes = timer.children[2].firstElementChild;
const fieldSeconds = timer.children[3].firstElementChild;

const buttonStart = document.querySelector('[data-start]');
buttonStart.addEventListener('click', startTimer);

function startTimer() {
  buttonStart.disabled = true;
  calendar.input.disabled = true;

  renderTime(userSelectedDate);

  intervalID = setInterval(renderTime, sec, userSelectedDate);
}
function renderTime(time) {
  const interval = time - Date.now();
  if (interval <= 0) {
    clearInterval(intervalID);
    calendar.input.disabled = false;
    timer.style.cssText = '';
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(interval);

  fieldDays.textContent = addLeadingZero(days);
  fieldHours.textContent = addLeadingZero(hours);
  fieldMinutes.textContent = addLeadingZero(minutes);
  fieldSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return (value ?? '00').toString().padStart(2, '0');
}

clearInterval(intervalID);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
