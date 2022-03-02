

let content = document.querySelector(".content");

window.addEventListener("scroll", () => {
  let nav = document.querySelector(".nav-fixed");
  let button = document.getElementById("signin-button");
  let contentPosition = content.getBoundingClientRect().top;
  let screenPosition = window.innerHeight / 8;
  if (contentPosition < screenPosition) {
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
      localStorage.setItem("main", JSON.stringify(data.slice(160, 250)));
    });
}

let allShowsLocalStorage = localStorage.getItem("main");
const allShowsObject = JSON.parse(allShowsLocalStorage);

function showAll() {
  let output = `<h1 class="heading">All Shows</h1>`;
  let bannerMain = document.getElementById('banner-main')
  bannerMain.innerHTML = `
  <div class="logo-in-banner material-icons">live_tv</div>
    <h1 class="h1-in-banner">Find TV Show</h1>
    <h5 class="h5-in-banner">Avoid spoilers, keep up to date</h5>
    <button class="join-for-free">JOIN FOR FREE</button>
  `
  bannerMain.style.height = ('100vh');
  bannerMain.style.transform = ('translateY(0px)');
  document.querySelector('.arrows').style.display = ('flex')
  allShowsObject.forEach((show) => {
    if (show._embedded.show.image) {
      output += `
<div class="card-main" id="${show._embedded.show.id}" style="background-image:url(${show._embedded.show.image.original})" >
<p class="card-heading">${show._embedded.show.name}</p>
<a href="" class="card-details" data-id="${show._embedded.show.id}">Show more</a>

</div>
</div>
`;
    }
    
    content.innerHTML = output;

  });
}

document.addEventListener('click', showSingle);

function showSingle(e){
  e.preventDefault();
  let id = e.target.getAttribute('data-id');
  let foundShow = allShowsObject.find( show => show._embedded.show.id == id );

  if(foundShow){

  let myShow = foundShow._embedded.show;
  let bannerMain = document.querySelector('.banner-main');
  bannerMain.innerHTML = ` 
  <h1 class="h1-in-banner">${myShow.name}</h1>
  <button class="join-for-free back-to-all">BACK TO ALL SHOWS</button>
  `;
  bannerMain.style.height = ('40vh');
  bannerMain.style.transform = ('translateY(120px)');
  document.querySelector('.arrows').style.display = ('none')
  let backButton = document.querySelector('.back-to-all');
  backButton.addEventListener('click', ()=>{showAll()})
  let getSummary = foundShow._embedded.show.summary;
  let summary = getSummary.slice(0, 400) + ' ...'

  let output = `
  <div class="card-small" id="${myShow.id}" style="background-image:url(${myShow.image.original})"></div>
  <div class="description-holder">
  <div class="show-description">${summary}</div>
  <a href="http://www.imdb.com/title/${myShow.externals.imdb}" target="_self"><img class="imdb-img" src="./img/imdb-logo.png"/></a>
  
  </div>
  </div>
  `
  
  content.innerHTML = output;
  }
}













showAll();