// Get all elements with class "true"
const trueDivs = document.querySelectorAll('.true');

// Get all elements with class "false"
const falseDivs = document.querySelectorAll('.false');

// Add click event listener to trueDivs
trueDivs.forEach(div => {
  div.addEventListener('click', () => {
    div.classList.add('clicked');
  });
});

// Add click event listener to falseDivs
falseDivs.forEach(div => {
  div.addEventListener('click', () => {
    div.classList.add('clicked');
  });
});



