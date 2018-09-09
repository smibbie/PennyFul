document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector("form");
  let email = document.getElementById("inputEmail");
  let password = document.getElementById("inputPassword");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let data = {
      email: email.value,
      password: password.value
    };

    console.log(data);

    fetch(`/api/login`, {
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
        window.location.replace(data);
      })
      .catch(err => console.log(err));
  });


});
