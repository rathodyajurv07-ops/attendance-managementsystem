// ====== Login ======
function login() {
  const role = document.getElementById("roleSelect").value;
  const password = document.getElementById("password").value;

  // simple password check
  if ((role === "admin" && password === "admin123") ||
      (role === "teacher" && password === "teacher123")) {
    localStorage.setItem("role", role);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}

// ====== Role-based Access ======
window.onload = function() {
  if (window.location.pathname.endsWith("dashboard.html")) {
    const role = localStorage.getItem("role");
    if (!role) window.location.href = "index.html"; // redirect if not logged in

    if (role === "teacher") {
      document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    }
    loadAttendance();
  }
}

// ====== Attendance Data ======
let attendanceData = [];

function addAttendance() {
  const name = document.getElementById("studentName").value;
  const cls = document.getElementById("studentClass").value;
  const date = document.getElementById("attendanceDate").value;
  const present = document.getElementById("attendanceStatus").checked ? "Yes" : "No";

  if (!name || !date) {
    alert("Fill all fields");
    return;
  }

  attendanceData.push({ name, class: cls, date, present });
  renderTable();
}

// ====== Render Table ======
function renderTable() {
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";
  attendanceData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td class="class">${row.class}</td>
      <td class="date">${row.date}</td>
      <td>${row.present}</td>
    `;
    tbody.appendChild(tr);
  });
}

function loadAttendance() {
  renderTable();
}

// ====== Filter ======
function filterAttendance() {
  const date = document.getElementById("filterDate").value;
  const cls = document.getElementById("filterClass").value;
  document.querySelectorAll("#attendanceTable tbody tr").forEach(row => {
    const rowDate = row.querySelector(".date").innerText;
    const rowClass = row.querySelector(".class").innerText;
    if ((date === "" || rowDate === date) &&
        (cls === "" || rowClass === cls)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// ====== Export ======
function exportExcel() {
  let table = document.getElementById("attendanceTable");
  let wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, "Attendance.xlsx");
}

function exportPDF() {
  const doc = new jsPDF();
  doc.autoTable({ html: '#attendanceTable' });
  doc.save('Attendance.pdf');
      }
