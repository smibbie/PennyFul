document.addEventListener("DOMContentLoaded", () => {
  const cards = document.getElementById('budget');
  const form = document.getElementById('add-budget');
  const editForm = document.getElementById('edit-form');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-btn');
  let name = document.getElementById('name');
  let total_balance = document.getElementById('total_balance');
  let new_name = document.getElementById('new_name');
  let new_total_balance = document.getElementById('new_total_balance');

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
      card.setAttribute("title", "double-click to delete");
      card.innerHTML =
      `<h4 id="category">${name}</h4>
      <p id="amount">$${total}.00</p>
      <button class="edit-btn" id="edit-btn">Edit</button>`;
      cards.appendChild(card);
    }
  }

  function updateCard(previousName, data) {
    console.log('updateCard function called');

    fetch(`/api/budgets/${userID}/${previousName}`, {
        method: "PUT",
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

  function popModal(previousName) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let data = {
        name: new_name.value,
        total_balance: new_total_balance.value,
      }
      console.log(data);
      modal.style.display = 'none';
      updateCard(previousName, data);
    });
  }

// Listeners ---------------------------------------

// Cards collection
  cards.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    let currentCard = e.target;
    console.log(currentCard);
    deleteCard(currentCard);
  });

  cards.addEventListener("click", (e) => {
    if (e.target.className === 'edit-btn') {
      modal.style.display = 'block';
      console.log(e.target.parentNode);
      let parentCard = e.target.parentNode;
      let firstChildElem = parentCard.firstChild;
      let previousName = firstChildElem.textContent;
      console.log(previousName);
      popModal(previousName);
    }
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

  closeBtn.addEventListener("click", () => {
    modal.style.display = 'none';
  });

  // End of DOM loaded wrapper
});
