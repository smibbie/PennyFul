document.addEventListener("DOMContentLoaded", () => {
  const cards = document.getElementById('budget');
  const form = document.getElementById('add-budget');
  let name = document.getElementById('name');
  let total_balance = document.getElementById('total_balance');
  let userID = '';

// Initial Fetch ---------------------------------
  fetch(`/api/user_data`, {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      userID = data.id;
      getBudget(userID);
      console.log(data);
    })
    .catch(err => console.log(err));


// CRUD operations ---------------------------------
  function getBudget(userID) {
    fetch(`/api/budgets/user/${userID}`, {
      method: 'GET',
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      createCard(data);
      console.log(data);
    })
    .catch(err => console.log(err));
  }

  function createCard(data) {
    for (i = 0; i < data.length; i++) {
      let name = data[i].name;
      let total = data[i].total_balance;
      let id = data[i].id;
      let card = document.createElement('div');
      card.className = 'card';
      card.setAttribute("data-id", id);
      card.innerHTML =
      `<h4 id="category">${name}</h4>
      <p id="amount">$${total}.00</p>
      <button>Edit</button>`;
      cards.appendChild(card);
    }
  }

  function updateCard() {

  }

  function deleteCard(currentCard) {
    let data = currentCard.getAttribute('data-id');

    console.log(data);
    currentCard.remove();

    fetch(`/api/budgets/${data}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log('Successfully deleted from database');
      })
      .catch(err => console.log(err));

  }

// Listeners ---------------------------------------

// Cards collection
  cards.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    let currentCard = e.target;
    console.log(currentCard);
    deleteCard(currentCard);
  });

// Add addition budgets form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let data = {
      name: name.value,
      total_balance: total_balance.value,
      UserId: userID
    }

    console.log(data);

    fetch(`/api/budgets`, {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch(err => console.log(err));

  });

  // End of DOM loaded wrapper
});
