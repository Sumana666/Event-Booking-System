document.addEventListener("DOMContentLoaded", function () {
  // Calendar functionality
  const calendarGrid = document.querySelector(".calendar-grid");
  const selectedDateElement = document.getElementById("selected-date");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  let currentDate = new Date(2025, 3, 1); // April 2025 (months are 0-indexed)
  let selectedDate = new Date(2025, 3, 2); // April 2, 2025

  // Booked dates for demonstration
  const bookedDates = [
    "2025-04-05",
    "2025-04-8",
    "2025-04-23",
    "025-04-30",
    "2025-05-03",
    "2025-05-12",
    "2025-06-13",
    "2025-07-12",
    "2025-07-27",
    "2025-09-24",
    "2025-12-12",
    "2026-02-12",
    "2026-02-21",
    "2026-04-23",
    "2026-06-15",
    "2026-10-20",
  ];

  // Event dates for demonstration
  const eventDates = [
    { date: "2025-04-5", title: "Tech Talk", location: "Mumbai" },
    { date: "2025-04-8", title: "Design Workshop", location: "Delhi" },
    { date: "2025-04-23", title: "Startup Summit", location : "Bangaluru"},
    { date: "2025-04-30", title: "Startup Expo", location: "Hyderabad" },
    {date: "2025-05-03",title: "Health & Wellness Fair",location: "Chennai"},
    { date: "2025-05-12", title: "Green Future Conference", location: "Pune" },
    { date: "2025-06-13", title: "Design Thinking Workshop", location : "pune"},
    { date: "2025-07-12", title: "Women in Tech Conference", location : "Chennai"},
    { date: "2025-07-27", title: "Cybersecurity Meet", location :" Ahmedabad"},
    { date: "2025-09-24", title : "Blockchain Bootcamp", location : "Kolkata"},
    { date: "2025-12-12", title: "Data Science Hackaathon", location : "Jaipur"},
    { date: "2026-02-12", title: "AI Innovation Fair", location : "Hydrabad"},
    { date: "2026-02-21", title: "ED Tech Symposium",location : "Kochi"},
    { date: "2026-04-23", title: "DevFest", location : "Delhi"},
    { date: "2026-06-15", title: "Mobile App Hackathon", location : "Kochi"},
    { date: "2026-10-20", title: "Robotics Expo", location : "Nagpur"},
  ];

  // Render calendar
  function renderCalendar() {
    // Clear previous calendar days (except headers)
    while (calendarGrid.children.length > 7) {
      calendarGrid.removeChild(calendarGrid.lastChild);
    }

    function renderEventCards() {
        const eventList = document.querySelector(".events-list");
        eventList.innerHTML = "<h3>Upcoming Events</h3>";
      
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time
      
        const upcomingEvents = eventDates.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });
      
        if (upcomingEvents.length === 0) {
          eventList.innerHTML += "<p>No upcoming events.</p>";
          return;
        }
      
        upcomingEvents.forEach((event) => {
          const card = document.createElement("div");
          card.className = "event-card";
          card.innerHTML = `
            <h3>${event.title}</h3>
            <p>${new Date(event.date).toLocaleDateString()}, ${event.location}</p>
            <button class="event-book-btn" data-date="${event.date}">Book Now</button>
          `;
          eventList.appendChild(card);
        });
      
        // Book button event listeners
        document.querySelectorAll(".event-book-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const dateString = button.getAttribute("data-date");
            const [year, month, day] = dateString.split("-");
            selectedDate = new Date(year, month - 1, day);
            selectedDateElement.textContent = dateString;
            renderCalendar();
          });
        });
      }      
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString("default", { month: "long" });

    document.querySelector("h2").textContent = `${monthName} ${year}`;

    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day empty";
      calendarGrid.appendChild(emptyDay);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);

      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;

      // Check if date is booked
      if (bookedDates.includes(dateString)) {
        dayElement.classList.add("booked");
        dayElement.title = "This date is already booked";
      } else {
        dayElement.classList.add("available");
      }

      // Check if date has events
      const hasEvent = eventDates.some((event) => event.date === dateString);
      if (hasEvent) {
        dayElement.classList.add("has-events");
        const event = eventDates.find((event) => event.date === dateString);
        dayElement.title = event.title;
      }

      // Highlight selected date
      if (dateString === formatDate(selectedDate)) {
        dayElement.classList.add("selected");
      }

      // Add click event
      dayElement.addEventListener("click", function () {
        if (!dayElement.classList.contains("empty")) {
          selectedDate = date;
          selectedDateElement.textContent = dateString;
          renderCalendar(); // re-render calendar to highlight selected date
      
          const event = eventDates.find((event) => event.date === dateString);
          const eventDetailsBox = document.getElementById("event-details");
      
          // Always show event details if available
          if (event) {
            document.getElementById("event-title").textContent = `Title: ${event.title}`;
            document.getElementById("event-date").textContent = `Date: ${event.date}, Location: ${event.location}`;
            eventDetailsBox.style.display = "block";
          } else {
            document.getElementById("event-title").textContent = "No events on this day.";
            document.getElementById("event-date").textContent = "";
            eventDetailsBox.style.display = "block";
          }
      
          // Show form only for available (not booked) dates
          const bookingForm = document.getElementById("booking-form");
          const confirmationMessage = document.getElementById("confirmation-message");
          if (dayElement.classList.contains("available")) {
            bookingForm.style.display = "flex";
          } else {
            bookingForm.style.display = "none";
            confirmationMessage.style.display = "none";
          }
        }
      });      
      calendarGrid.appendChild(dayElement);
    }
    renderEventCards();
  }

  // Format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Navigation buttons
  prevMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Event book buttons
  document.querySelectorAll(".event-book-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const dateString = button.getAttribute("data-date");
      const [year, month, day] = dateString.split("-");
      selectedDate = new Date(year, month - 1, day);
      selectedDateElement.textContent = dateString;
      renderCalendar();
    });
  });

  // Form validation
  const bookingForm = document.getElementById("booking-form");
  const confirmationMessage = document.getElementById("confirmation-message");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Validate name
    const name = document.getElementById("name");
    const nameError = document.getElementById("name-error");
    if (!name.value.trim()) {
      nameError.style.display = "block";
      isValid = false;
    } else {
      nameError.style.display = "none";
    }

    // Validate email
    const email = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      emailError.textContent = "Email is required";
      emailError.style.display = "block";
      isValid = false;
    } else if (!emailRegex.test(email.value)) {
      emailError.textContent = "Please enter a valid email";
      emailError.style.display = "block";
      isValid = false;
    } else {
      emailError.style.display = "none";
    }

    // Validate phone
    const phone = document.getElementById("phone");
    const phoneError = document.getElementById("phone-error");
    if (!phone.value.trim()) {
      phoneError.textContent = "Contact number is required";
      phoneError.style.display = "block";
      isValid = false;
    } else {
      phoneError.style.display = "none";
    }

    // Validate attendees
    const attendees = document.getElementById("attendees");
    const attendeesError = document.getElementById("attendees-error");
    if (!attendees.value || parseInt(attendees.value) < 1) {
      attendeesError.textContent = "Please enter a valid number of attendees";
      attendeesError.style.display = "block";
      isValid = false;
    } else {
      attendeesError.style.display = "none";
    }

    // Validate event type
    const eventType = document.getElementById("event-type");
    const eventTypeError = document.getElementById("event-type-error");
    if (!eventType.value) {
      eventTypeError.textContent = "Please select an event type";
      eventTypeError.style.display = "block";
      isValid = false;
    } else {
      eventTypeError.style.display = "none";
    }

    // If form is valid, show confirmation
    if (isValid) {
      bookingForm.style.display = "none";
      confirmationMessage.style.display = "block";

      // Reset form after 3 seconds (for demo purposes)
      setTimeout(() => {
        bookingForm.reset();
        bookingForm.style.display = "flex";
        confirmationMessage.style.display = "none";
      }, 3000);
    }
  });

  // Initial render
  renderCalendar();
});
