// Mock Data for initial Transactions
let defaultData = [
  { id:1, date: "2026-01-05", amount: 5000, category: "Salary", type: "income" },
  { id:2, date: "2026-01-10", amount: 1200, category: "Food", type: "expense" },


  { id: 3,date:"2026-02-03", amount:2000, category: "Freelance", type: "income" },
  { id: 4,date:"2026-02-08", amount: 800, category: "Travel", type: "expense" },

  { id:5, date:"2026-03-01", amount: 5000, category: "Salary",type: "income" },
  { id:6, date:"2026-03-02", amount: 1500, category: "Shopping", type: "expense" },

  { id:7, date: "2026-04-04", amount: 4000, category: "Salary", type: "income" },
  { id: 8, date: "2026-04-06", amount: 1000, category: "Food", type: "expense" }
];

let saved = localStorage.getItem("transactions");
let savedRole = localStorage.getItem("role");

let state = {
  transactions: saved ? JSON.parse(saved) : defaultData,
  role: savedRole ? savedRole : "viewer",  
  search: "",
  filter: "all"
};

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(state.transactions));
}

// Summary Cards
function loadCards() {
  let inc = 0;
  let exp = 0;

  state.transactions.forEach(d => {
    if (d.type === "income") inc += d.amount;
    else exp += d.amount;
  });

  let bal = inc - exp;

  document.getElementById("cards").innerHTML = `
    <div class="card">Balance: ₹${bal}</div>
    <div class="card">Income: ₹${inc}</div>
    <div class="card">Expense: ₹${exp}</div>
  `;
}

// Data visualization through charts
let lineChart, pieChart;

function loadCharts() {

  if (!state.transactions || state.transactions.length === 0) return;

  let monthlyMap = {};

  state.transactions.forEach(t => {
    if (!t.date) return;

    let month = t.date.slice(0, 7);
    if (t.type === "expense") {
  monthlyMap[month] = (monthlyMap[month] || 0) + t.amount;
}
  });

  let labels = Object.keys(monthlyMap).map(m => formatMonth(m));
  let values = Object.values(monthlyMap);

  if (labels.length === 0) return;

  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();


  lineChart = new Chart(document.getElementById("line"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Monthly Expenditure",
        data: values
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });


  let catMap = {};

  state.transactions.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });

  pieChart = new Chart(document.getElementById("pie"), {
    type: "pie",
    data: {
      labels: Object.keys(catMap),
      datasets: [{
        data: Object.values(catMap)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// transactions
function loadTable(arr) {
  let colCount = state.role === "admin" ? 5 : 4;

  let t = `
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Category</th>
      <th>Type</th>
      ${state.role === "admin" ? "<th>Action</th>" : ""}
    </tr>
  `;

  if (arr.length === 0) {
    t += `<tr><td colspan="${colCount}">No data found</td></tr>`;
  } else {
    arr.forEach(x => {
      t += `
        <tr>
          <td>${formatMonth(x.date.slice(0, 7))}</td>
          <td>₹${x.amount}</td>
          <td>${x.category}</td>
          <td>${x.type}</td>
          ${
            state.role === "admin"
              ? `<td><button class="edit-btn" onclick="editItem(${x.id})">Edit</button></td>`
              : ""
          }
        </tr>
      `;
    });
  }

  document.getElementById("table").innerHTML = t;
}

function getFilteredData() {
  return state.transactions.filter(d => {
    let ok = d.category.toLowerCase().includes(state.search);

    if (state.filter !== "all") {
      ok = ok && d.type === state.filter;
    }

    return ok;
  });
}

document.getElementById("roleSelect").addEventListener("change", e => {
  state.role = e.target.value;

  localStorage.setItem("role", state.role); 

  updateUI();
});

document.getElementById("roleSelect").value = state.role;

document.getElementById("searchInput").addEventListener("input", e => {
  state.search = e.target.value.toLowerCase();
  updateUI();
});


document.getElementById("typeFilter").addEventListener("change", e => {
  state.filter = e.target.value;
  updateUI();
});


document.getElementById("add-Btn").addEventListener("click", () => {
  if (state.role !== "admin") return;

  let date = prompt("Enter date (YYYY-MM-DD):", "2026-03-01");
  let amt = prompt("Enter amount:");
  let cat = prompt("Enter category:");
  let type = prompt("income or expense:");

 
  if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    alert("Invalid date format (use YYYY-MM-DD)");
    return;
  }

  
  if (!amt || !cat || !type) return;

  state.transactions.push({
    id: Date.now(),
    date: date,
    amount: Number(amt),
    category: cat,
    type: type.toLowerCase()
  });

  saveData();
  updateUI();
  showToast("Transaction added successfully");
});

function editItem(id) {
  if (state.role !== "admin") return;

  let item = state.transactions.find(t => t.id === id);
  if (!item) return;

  let newDate = prompt("Edit date (YYYY-MM-DD):", item.date);
  let newAmount = prompt("Edit amount:", item.amount);
  let newCategory = prompt("Edit category:", item.category);
  let newType = prompt("Edit type (income/expense):", item.type);

 
  if (!newDate || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    alert("Invalid date format (use YYYY-MM-DD)");
    return;
  }

  if (!newAmount || !newCategory || !newType) return;


  item.date = newDate;
  item.amount = Number(newAmount);
  item.category = newCategory;
  item.type = newType.toLowerCase();

  saveData();
  updateUI();
  showToast("Transaction updated");
}


function formatMonth(monthStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let [year, month] = monthStr.split("-");
  return months[parseInt(month) - 1] + " " + year;
}

// Insights
function loadInsights() {

  if (!state.transactions || state.transactions.length === 0) {
    document.getElementById("insightBox").innerHTML = "No data available";
    return;
  }

  let expenseMap = {};
  let monthly = {};

  state.transactions.forEach(t => {
    if (!t.date) return;

    let month = t.date.slice(0, 7);

    
    if (t.type === "expense") {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    }

    monthly[month] = (monthly[month] || 0) + t.amount;
  });

 
  let topCategory = "N/A";
  let max = 0;

  for (let k in expenseMap) {
    if (expenseMap[k] > max) {
      max = expenseMap[k];
      topCategory = k;
    }
  }

  
  let months = Object.keys(monthly).sort();
  let comparisonText = "Not enough data";

  if (months.length >= 2) {
    let lastMonth = months[months.length - 1];
    let prevMonth = months[months.length - 2];

    let last = monthly[lastMonth] || 0;
    let prev = monthly[prevMonth] || 0;

    if (last > prev) {
      comparisonText = `Spending increased from ${formatMonth(prevMonth)} to ${formatMonth(lastMonth)}`;
    } else if (last < prev) {
      comparisonText = `Spending decreased from ${formatMonth(prevMonth)} to ${formatMonth(lastMonth)}`;
    } else {
      comparisonText = `No change between ${formatMonth(prevMonth)} and ${formatMonth(lastMonth)}`;
    }
  }

  let totalIncome = 0;
  let totalExpense = 0;

  state.transactions.forEach(t => {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  let observation = "";

  if (max > 0 && max > 1500) {
    observation = "You are spending a lot on " + topCategory;
  } else if (totalExpense > totalIncome) {
    observation = "Your expenses are higher than your income";
  } else {
    observation = "Your spending looks balanced";
  }

  document.getElementById("insightBox").innerHTML = `
    <h2>Insights </h2>
    <p><b>Top Category:</b> ${topCategory}</p>
    <p><b>Monthly Trend:</b> ${comparisonText}</p>
    <p><b>Observation:</b> ${observation}</p>
  `;
}


function updateUI() {
  let filtered = getFilteredData();

  setTimeout(() => {
  loadCharts();
}, 100);
  loadTable(filtered);
  loadInsights();
  loadCharts();

  document.getElementById("add-Btn").style.display =
    state.role === "admin" ? "block" : "none";
}

updateUI();

// Toast notification
function showToast(msg) {
  let toast = document.getElementById("toast");

  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}


// Theme
let dark = false;

document.getElementById("theme").addEventListener("click", () => {
  dark = !dark;

  if (dark) {
    document.body.classList.add("dark");
    document.getElementById("theme").innerText = "☀️";
  } else {
    document.body.classList.remove("dark");
    document.getElementById("theme").innerText = "🌙";
  }
});