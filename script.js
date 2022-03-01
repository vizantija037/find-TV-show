let content = document.querySelector(".content");

window.addEventListener("scroll", () => {
  let nav = document.querySelector(".nav-fixed");
  let button = document.getElementById('signin-button');
  let contentPosition = content.getBoundingClientRect().top;
  let screenPosition = window.innerHeight / 8;
  if (contentPosition < screenPosition) {
    console.log("ovde");
    nav.classList.add("nav-fixed-active");
    button.classList.add("active");
  } else {
    nav.classList.remove("nav-fixed-active");
    button.classList.remove("active");
  }
});

const searchButton = document.getElementById("search-icon");
searchButton.addEventListener("click", () => {
  let searchField = document.getElementById("input-search");
  searchField.classList.toggle("inpute-search-active");
  searchButton.classList.toggle("active");
});

document.addEventListener("click", function (e) {
  let searchField = document.getElementById("input-search");
  if (e.target === searchField || e.target === searchButton) {
    return;
  } else {
    searchField.classList.remove("inpute-search-active");
    searchButton.classList.remove("active");
  }
});

window.addEventListener("load", toFetch);

function toFetch() {
  fetch("https://api.tvmaze.com/schedule/full")
    .then((resp) => resp.json())
    .then((data) => {
      localStorage.setItem("main", JSON.stringify(data.slice(100, 150)));
    });
}

let allShowsLocalStorage = localStorage.getItem("main");
let cardHover = document.querySelectorAll(".card-heading");

const allShowsObject = JSON.parse(allShowsLocalStorage);

let output = `<h1 class="heading">All Shows</h1>`;
allShowsObject.forEach((show) => {
  output += `
<div class="card-main" id="${show._embedded.show.id}" style="background-image: url(${show._embedded.show.image.original})">
<p class="card-heading">${show._embedded.show.name}</p>
<a href="" class="card-details" data-id="${show._embedded.show.id}">Show more</a>

</div>
</div>
`;
  document.querySelector(".content").innerHTML = output;

 
});
