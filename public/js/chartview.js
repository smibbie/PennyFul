document.addEventListener("DOMContentLoaded", () => {

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

let categories = [];
let categoryValue = [];

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
    for (i = 0; i < data.length; i++){
      categories.push(`${data[i].name}: $${data[i].total_balance}`);
      categoryValue.push(`${data[i].total_balance}`);
    }
    getChart();
    console.log(data);
  })
  .catch(err => console.log(err));
}

// Chart.js render ----------------------------------
function getChart() {
  new Chart(document.getElementById("budget-chart"), {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Budget (Dollars)",
          backgroundColor: [
            "#0000ff",
            "#ee82ee",
            "#3cba9f",
            "#e8c3b9",
            "#c45850",
            "#00bfff",
            "#b22222",
            "#228b22",
            "#d2691e",
            "#4b0082",
            "#ffd700"
          ],
          data: categoryValue
        }
      ]
    },
    options: {
      response: true,
      title: {
        text: "Snapshot",
        display: true,
        fontSize: 26,
        fontFamily: "Montserrat",
        fontColor: "#225470",
        padding: 30
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          fontSize: 16,
          boxWidth: 20,
          fontFamily: "Montserrat",
          fontColor: "#225470",
          padding: 25
        }
      },
      tooltips: {
        callbacks: {
          // function converting expenses into percentages/month.
          label: function(tooltipItem, data) {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let meta = dataset._meta[Object.keys(dataset._meta)[0]];
            let total = meta.total;
            let currentValue = dataset.data[tooltipItem.index];
            let percentage = parseFloat(
              ((currentValue / total) * 100).toFixed(1)
            );
            return " (" + percentage + "%)";
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }
  });
}

  // end DOMContentLoaded wrapper
});
