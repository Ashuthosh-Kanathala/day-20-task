const amountInput = document.getElementById("incomeinput");
const descriptionInput = document.getElementById("descriptioninput");
const typeSelect = document.getElementById("typeOf");
const tableBody = document.querySelector("tbody");
const addButton = document.querySelector("#addInput");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editIndex = null;

function saveToLocalStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function calculateTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;

  entries.forEach((entry) => {
    const amount = parseFloat(entry.amount);
    if (entry.type === "income") {
      totalIncome += amount;
    } else if (entry.type === "expenses") {
      totalExpenses += amount;
    }
  });

  const leftOutMoney = totalIncome - totalExpenses;

  // Update the UI
  document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
  document.getElementById("totalExpenses").textContent =
    totalExpenses.toFixed(2);
  document.getElementById("leftOutMoney").textContent = leftOutMoney.toFixed(2);
}

function displayEntries() {
  tableBody.innerHTML = "";

  // Get selected radio button
  const selectedFilter = document.querySelector(
    'input[name="choices"]:checked'
  )?.id;

  entries.forEach((entry, index) => {
    // Filter entries based on selected radio
    if (
      (selectedFilter === "option2" && entry.type !== "income") ||
      (selectedFilter === "option3" && entry.type !== "expenses")
    ) {
      return; // skip entries that don’t match the selected filter
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${entry.amount}</td>
        <td>${entry.description}</td>
        <td>${entry.type}</td>
        <td>
          <button onclick="editEntry(${index})">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);

    calculateTotals();
  });

  if (editIndex === null) {
    addButton.textContent = "ADD";
  }
}

function addOrUpdateEntry() {
  const amount = amountInput.value.trim();
  const description = descriptionInput.value.trim();
  const type = typeSelect.value;

  if (!amount || !description || !type) {
    alert("Please fill out all fields.");
    return;
  }

  const newEntry = { amount, description, type };

  if (editIndex !== null) {
    // Update mode
    entries[editIndex] = newEntry;
    editIndex = null;
  } else {
    // Add mode
    entries.push(newEntry);
  }

  saveToLocalStorage();
  displayEntries();
  calculateTotals();

  amountInput.value = "";
  descriptionInput.value = "";
  typeSelect.value = "";
}

function editEntry(index) {
  const entry = entries[index];
  amountInput.value = entry.amount;
  descriptionInput.value = entry.description;
  typeSelect.value = entry.type;
  editIndex = index;

  calculateTotals();
}

function deleteEntry(index) {
  entries.splice(index, 1);
  saveToLocalStorage();
  displayEntries();

  calculateTotals();
}

// Trigger add or update on Enter in description
addButton.addEventListener("click", function (e) {
  e.preventDefault();

  addOrUpdateEntry();
  calculateTotals();
});

document.querySelectorAll('input[name="choices"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    displayEntries();
    calculateTotals();
  });
});
