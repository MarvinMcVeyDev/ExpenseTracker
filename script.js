/** This is a simple expense tracker script. This script handles adding expenses and displaying them in a list. */

// Get references to the form and the expense list
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpensesSpan = document.getElementById('total-expenses');
const tableBody = document.getElementById('tableBody');

// Function to store local memory of expenses

function storeExpenses(expenseName, expenseAmount, expenseDate) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ name: expenseName, amount: expenseAmount, date: expenseDate });
    localStorage.setItem('expenses', JSON.stringify(expenses));

}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenses.forEach(expense => {
        addToTable();
        const formattedDate = formatDate(expense.date);
    });
    updateTotalExpenses();
}

// Function to format the date nicer in JavaScript

function formatDate(expenseDate) {
    const date = new Date(expenseDate + "T12:00:00");
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// Function to add an expense to the list
function addExpense(event) {
    event.preventDefault(); // Prevent the form from submitting
    


    // Get the values from the form inputs
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = document.getElementById('expense-amount').value;
    const expenseDate = document.getElementById('expense-date').value;

    const formattedDate = formatDate(expenseDate);


    

    storeExpenses(expenseName, expenseAmount, expenseDate); // Store the expense in local storage.

    addToTable();

    
    updateTotalExpenses();

    // Clear the form inputs
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
}

// Function to grab, modify and save back localStorage expenses
function updateLocalStorage() {
    const expenses = [];
    const expenseItems = tableBody.getElementsByTagName('td');

    for (let i = 0; i < expenseItems.length; i++) {
        const expenseText = expenseItems[i].textContent;
        const [name, amount, date] = expenseText.split(') $');
        expenses.push({ name, date, amount: parseFloat(amount) });
    }


    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to update the total expenses displayed
function updateTotalExpenses() {
    let total = 0;
    const row = checkboxElement.closest('tr');
    const expenses = row.querySelector('.amount');

    console.log(expenses.textContent);

    for (let i = 0; i < expenses.length; i++) {
        const expenseText = expenses[i].textContent;
        const amount = parseFloat(expenseText.split('$')[1]);
        total += amount;
    }

    totalExpensesSpan.textContent = total.toFixed(2);
    totalExpensesSpan.style.color = total > 1000 ? 'red' : 'white'; // Change color if total exceeds $1000
}
// Function to delete selected expenses from the list
function deleteExpense(event) {
    const checkbox = document.querySelectorAll('.row-checkbox:checked');
    let i;
        for ( i = 0; i < checkbox.length; i++) {
            const expenseItem = checkbox[i].parentElement.parentElement;
            tableBody.removeChild(expenseItem);
            updateLocalStorage(); // Update local storage after deletion
        updateTotalExpenses();
    }
}


// Function to add the expenses to the table

function addToTable() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    expenses.forEach(expenseItem => {
        const formattedDate = formatDate(expenseItem.date);

        const rowHTML = `
        <tr>
        <td><input type="checkbox" class="row-checkbox" data-name="${expenseItem.name}"></td>
        <td>${expenseItem.name}</td>
        <td id="amount">${expenseItem.amount}</td>
        <td>${formattedDate}</td>
        </tr>
    `;

    tableBody.innerHTML += rowHTML;
    });
}
/**                                  Event Listeners                             */


// Add an event listener to the form to handle submission
expenseForm.addEventListener('submit', addExpense);

// Add an event listener to the delete button
document.getElementById('delete-expenses').addEventListener('click', deleteExpense);

// Add event listeners to the clear and delete buttons
document.getElementById('clear-expenses').addEventListener('click', () => {
    tableBody.innerHTML = '';
    localStorage.removeItem('expenses');
    updateTotalExpenses();
});

/**                                     Main code                       */
loadExpenses(); // Load stored expenses when the page loads