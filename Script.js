const calendar = document.querySelector(".calendar");
const monthYear = document.getElementById("monthYear");
const eventList = document.getElementById("eventList");
const latestBookingDiv = document.getElementById("latestBooking");
const message = document.getElementById("message");
const selectedEventText = document.getElementById("selectedEvent");
const selectedDateText = document.getElementById("selectedDate");

let currentDate = new Date();
let selectedEvent = null;
let selectedDate = null;

const events = [
  { title: "AI Innovation Fair", type: "Expo", date: "2026-01-15", capacity: 2, booked: 2 },
  { title: "Startup Expo", type: "Expo", date: "2026-02-10", capacity: 3, booked: 0 },
  { title: "Cloud Conference", type: "Conference", date: "2026-04-23", capacity: 4, booked: 2 },
  { title: "Web Dev Workshop", type: "Workshop", date: "2026-04-18", capacity: 2, booked: 2 },
  { title: "Cyber Security Seminar", type: "Seminar", date: "2026-04-27", capacity: 6, booked: 1 }
];

function renderCalendar() {
  calendar.querySelectorAll(".day").forEach(d => d.remove());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= days; d++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.className = "day available";

    const dayEvents = events.filter(e => e.date === fullDate);
    if (dayEvents.some(e => e.booked >= e.capacity)) {
      cell.className = "day booked";
    }

    cell.onclick = () => {
      document.querySelectorAll(".day").forEach(x => x.classList.remove("selected"));
      cell.classList.add("selected");

      selectedDate = fullDate;
      selectedDateText.textContent = fullDate;
      selectedEvent = null;
      selectedEventText.textContent = "None";

      renderEventsByMonth();
    };

    calendar.appendChild(cell);
  }

  renderEventsByMonth();
}

function renderEventsByMonth() {
  eventList.innerHTML = "";

  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, "0");

  const monthEvents = events.filter(e => e.date.startsWith(`${y}-${m}`));

  if (!monthEvents.length) {
    eventList.innerHTML = "<p>No events this month</p>";
    return;
  }

  monthEvents.forEach(e => {
    const closed = e.booked >= e.capacity;
    const div = document.createElement("div");
    div.className = "event";

    div.innerHTML = `
      <strong>${e.title}</strong><br>
      <small>${e.date} | ${e.type}</small><br>
      <button class="${closed ? "closed" : "book-now"}">
        ${closed ? "Booking Closed" : "Book Now"}
      </button>
    `;

    div.querySelector("button").onclick = () => {
      if (closed) {
        showMessage(`Booking is closed for ${e.title}`, "error");
      } else {
        selectedEvent = e;
        selectedEventText.textContent = `${e.title} (${e.date})`;
        eventType.value = e.type;
      }
    };

    eventList.appendChild(div);
  });
}

document.getElementById("bookingForm").onsubmit = e => {
  e.preventDefault();

  if (!selectedDate) {
    showMessage("Please select a date from the calendar", "error");
    return;
  }

  if (!selectedEvent) {
    showMessage("Please select an event to book", "error");
    return;
  }

  selectedEvent.booked++;

  const booking = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    attendees: attendees.value,
    eventType: eventType.value,
    title: selectedEvent.title,
    date: selectedEvent.date
  };

  localStorage.setItem("latestBooking", JSON.stringify(booking));
  renderLatestBooking(booking);

  showMessage("Booking Confirmed 🎉", "success");
  e.target.reset();

  selectedEventText.textContent = "None";
  renderCalendar();
};

function renderLatestBooking(b) {
  latestBookingDiv.innerHTML = `
    <div>
      <strong>${b.title}</strong><br>
      Date: ${b.date} | ${b.eventType}<br>
      ${b.name} (${b.email})<br>
      Phone: ${b.phone} | Attendees: ${b.attendees}
    </div>
  `;
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = "block";
  setTimeout(() => message.style.display = "none", 3000);
}

document.getElementById("prev").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("next").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

const savedBooking = JSON.parse(localStorage.getItem("latestBooking"));
if (savedBooking) renderLatestBooking(savedBooking);

renderCalendar();
