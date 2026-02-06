let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let limit = localStorage.getItem("limit") || 3;
document.getElementById("hourLimit").value = limit;

let lastDeleted = null;
let lastDeletedIndex = null;

function save() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveLimit() {
  limit = document.getElementById("hourLimit").value;
  localStorage.setItem("limit", limit);
}

function addAppointment() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !date || !time) {
    alert("Please fill in required fields");
    return;
  }

  const count = appointments.filter(
    a => a.date === date && a.time === time
  ).length;

  if (count >= limit) {
    alert("Hourly limit reached for this time slot");
    return;
  }

  appointments.push({
    name,
    address,
    reason,
    date,
    time
  });

  save();
  closeModal();
  clearForm();
  render();
}

function remove(i) {
  if (!confirm("Delete this appointment?")) return;

  lastDeleted = appointments[i];
  lastDeletedIndex = i;

  appointments.splice(i, 1);
  save();
  render();

  showUndo();
}

function showUndo() {
  const bar = document.getElementById("undoBar");
  bar.style.display = "flex";

  clearTimeout(bar.timer);
  bar.timer = setTimeout(() => {
    hideUndo();
  }, 15000); // 15 seconds to undo
}

function hideUndo() {
  document.getElementById("undoBar").style.display = "none";
  lastDeleted = null;
  lastDeletedIndex = null;
}

function undoDelete() {
  if (lastDeleted === null) return;

  appointments.splice(lastDeletedIndex, 0, lastDeleted);
  save();
  render();
  hideUndo();
}



function clearAll() {
  if (confirm("Delete all appointments?")) {
    appointments = [];
    save();
    render();
  }
}

function render() {
  const q = search.value.toLowerCase();
  list.innerHTML = "";

  appointments
    .filter(a => Object.values(a).join(" ").toLowerCase().includes(q))
    .forEach((a, i) => {
      list.innerHTML += `
        <tr>
          <td>${a.name}</td>
          <td>${a.address}</td>
          <td>${a.reason}</td>
          <td>${new Date(a.date).toDateString()}</td>
          <td><span class="time-badge">${formatTime(a.time)}</span></td>

          <td><button onclick="remove(${i})">🗑</button></td>
        </tr>
      `;
    });

  total.textContent = appointments.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  today.textContent = appointments.filter(a => a.date === todayStr).length;
}

render();




function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
}


function formatTime(time24) {
  let [hour, minute] = time24.split(":");
  hour = parseInt(hour);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}
