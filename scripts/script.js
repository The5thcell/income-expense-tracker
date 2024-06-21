// console.log("Boilerplate");

let entries = [];

// get DOM elements

const select = document.querySelector("#entry-type");
const entryInputs = document.querySelectorAll(".entry");

// DOM Buttons
const addEntryBtn = document.querySelector("#addEntriesBtn");
const saveEntriesBtn = document.querySelector("#saveEntriesBtn");
const saveDocBtn = document.querySelector("#save-doc");
const clearEntriesBtn = document.querySelector("#clearEntriesBtn");

// console.log(
//   select,
//   entryInputs,
//   addEntryBtn,
//   saveEntriesBtn,
//   saveDocBtn,
//   clearEntriesBtn
// );

// Add event listeners on click to the buttons

addEntryBtn.onclick = () => addEntry();
saveEntriesBtn.onclick = () => saveEntries();
clearEntriesBtn.onclick = () => clearEntries();

saveDocBtn.onclick = () => exportToHTML();

// Change inout color

select.onchange = (e) => {
  const selectedType = e.target.value;
  if (selectedType === "income") {
    changeEntryColor();
  } else if (selectedType === "expense") {
    changeEntryColor("red");
  }
};

function changeEntryColor(color = "green") {
  entryInputs.forEach((input) => (input.style.outline = `1px solid ${color}`));
}
changeEntryColor();

// Add and display entries

function addEntry() {
  const type = select.value;
  const description = document.querySelector("#entry-description").value;
  const amount = parseFloat(document.querySelector("#entry-amount").value);

  if (description.trim() === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter valid data.");
    return;
  }

  const entry = { type, description, amount };

  entries.push(entry);

  document.querySelector("#entry-description").value = "";
  document.querySelector("#entry-amount").value = "";

  displayEntries();
}
function displayEntries() {
  const entriesList = document.querySelector("#entries");
  entriesList.innerHTML = "";

  let totalIncome = 0;
  let totalExpenses = 0;
  let netTotal = 0;

  for (const entry of entries) {
    const li = document.createElement("li");

    let symbol = `<i class="fa-solid fa-circle-plus"></i>`;

    if (entry.type === "expanse") {
      symbol = `<i class="fa-solid fa-circle-minus"></i>`;
    }
    li.innerHTML = `

            ${symbol} ${entry.description} - $${entry.amount.toFixed(2)}
            <i class="fa-solid fa-trash" onclick="deleteEntry(${entries.indexOf(
              entry
            )})"></i>
   
                    `;

    // Add Class

    if (entry.type === "income") {
      li.classList.add("income");
    } else if (entry.type === "expense") {
      li.classList.add("expense");
    }

    entriesList.appendChild(li);

    // Calc total
    if (entry.type === "income") {
      totalIncome += entry.amount;
      netTotal = totalIncome - totalExpenses;
    } else if (entry.type === "expense") {
      totalExpenses += entry.amount;
      netTotal = totalIncome - totalExpenses;
    }
  }
  console.log(totalIncome, totalExpenses);
  // Update totals

  document.querySelector("#total-income").textContent = totalIncome.toFixed(2);
  document.querySelector("#total-expenses").textContent =
    totalExpenses.toFixed(2);

  const netTotalElement = document.querySelector("#net-total");
  if (netTotal < 0) {
    netTotalElement.classList.remove("positive");
    netTotalElement.classList.add("negative");
  } else {
    netTotalElement.classList.remove("negative");
    netTotalElement.classList.add("positive");
  }

  netTotalElement.textContent = netTotal.toFixed(2);

  //   update charts

  chartEntries(totalIncome, totalExpenses);
}

// Delete entry

function deleteEntry(index) {
  if (window.confirm("Are you sure you want to delete this entry")) {
    entries.splice(index, 1);

    displayEntries();
  }
}

function chartEntries(totalIncome, totalExpenses) {
  // income

  const incomeBar = document.querySelector("#incomeBar");
  const incomeValueDisplay = document.querySelector("#incomeValueDisplay");

  let incomeFraction = (
    (totalIncome / (totalIncome + totalExpenses)) *
    100
  ).toFixed(2);

  incomeBar.style.width = `${incomeFraction}%`;

  incomeValueDisplay.textContent = isNaN(incomeFraction)
    ? (incomeFraction = 0 + "%")
    : `${incomeFraction}%`;

  // expanse

  const expenseBar = document.querySelector("#expenseBar");
  const expenseValueDisplay = document.querySelector("#expenseValueDisplay");

  let expenseFraction = (
    (totalExpenses / (totalIncome + totalExpenses)) *
    100
  ).toFixed(2);

  expenseBar.style.width = `${expenseFraction}%`;

  expenseValueDisplay.textContent = isNaN(expenseFraction)
    ? (expenseFraction = 0 + "%")
    : `${expenseFraction}%`;
}

function saveEntries() {
  if (entries.length === 0) {
    window.alert("No entries to save");
    return;
  }

  const jsonEntries = JSON.stringify(entries);
  localStorage.setItem("entries", jsonEntries);
  window.alert("Entries saved successfully");
}

function loadEntries() {
  if (localStorage.getItem("entries")) {
    entries = JSON.parse(localStorage.getItem("entries"));
  }
  displayEntries();
}
loadEntries();

window.addEventListener("beforeunload", saveEntries);

// Clear all entries

function clearEntries() {
  if (window.confirm("Are you sure you weant to delete all entries?")) {
    localStorage.clear();
    entries = [];
    displayEntries();
    chartEntries(0, 0);
  }
}

// display only btn icons

const allBtnText = document.querySelectorAll("button .text");

function hideText() {
  if (window.innerWidth < 500) {
    allBtnText.forEach((text) => (text.style.display = "none"));
  } else {
    allBtnText.forEach((text) => (text.style.display = "inline"));
  }
}

window.addEventListener("resize", hideText);

function getToday() {
  const date = new Date(),
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function exportToHTML() {
  if (entries.length === 0) {
    window.alert("No entries to export");
    return;
  }

  let doc = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Export Report</title>
    <style>
      body {
        font-family: sans-serif;
        margin: 1rem;
        margin-left: 3rem;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
  </head>
  <body>
    <h1>Export Report - ${getToday()}</h1>

    <h2>
      Total Income: $${document.getElementById("total-income").textContent}
    </h2>
    <h2>
      Total Expenses: $${document.getElementById("total-expenses").textContent}
    </h2>
    <h2>Net Total: $${document.getElementById("net-total").textContent}</h2>

    <table>
      <tr>
        <th>Type</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
   



`;

  for (const entry of entries) {
    doc += `
 
    
<tr>

<td>${entry.type}</td>
<td>${entry.description}</td>
<td>${entry.amount}</td>

</tr>\n
    `;
  }

  doc += `
     </table>
     </body>
     </html>
  `;

  const blob = new Blob([doc], { type: "text/html" });
  const a = document.createElement("a");
  a.download = `export-report-${getToday()}.html`;
  a.href = window.URL.createObjectURL(blob);
  a.target = "_blank";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Done
