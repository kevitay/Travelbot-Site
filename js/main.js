// Bind submit event of form
let form = document.querySelector('#search-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let destination = document.querySelector('#destination').value;

  localStorage.setItem('location', destination);

  window.location.href = 'pages/tripinfo.html';
});
// Prevent default
// store city value in local storage
