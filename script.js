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
      localStorage.setItem("main", JSON.stringify(data.slice(90, 130)));
    });
}

let allShowsLocalStorage = localStorage.getItem("main");
const allShowsObject = JSON.parse(allShowsLocalStorage);

function showAll() {
  let output = `<h1 class="heading">All Shows</h1>`;
  let bannerMain = document.getElementById("banner-main");
  bannerMain.innerHTML = `
  <div class="logo-in-banner material-icons">live_tv</div>
    <h1 class="h1-in-banner">Find TV Show</h1>
    <h5 class="h5-in-banner">Avoid spoilers, keep up to date</h5>
    <button class="join-for-free">JOIN FOR FREE</button>
  `;
  bannerMain.style.height = "100vh";
  bannerMain.style.transform = "translateY(0px)";
  document.querySelector(".arrows").style.display = "flex";
  allShowsObject.forEach((show) => {
    if (show._embedded.show.image) {
      output += `
<div class="card-main" id="${show._embedded.show.id}" style="background-image:url(${show._embedded.show.image.original})" >
<p class="card-heading">${show._embedded.show.name}</p>
<a class="card-details" data-id="${show._embedded.show.id}">Show more</a>

</div>
</div>
`;
    }

    content.innerHTML = output;
  });

  let testliste = document.getElementsByClassName("card-details");

  for (let i = 0; i < testliste.length; i++) {
    testliste[i].addEventListener("click", showSingle);
  }
}

function showSingle(e) {
  e.preventDefault();
  let id = e.target.getAttribute("data-id");
  let foundShow = allShowsObject.find((show) => show._embedded.show.id == id);

  if (foundShow) {
    let myShow = foundShow._embedded.show;
    let bannerMain = document.querySelector(".banner-main");
    bannerMain.innerHTML = ` 
  <h1 class="h1-in-banner">${myShow.name}</h1>
  <button class="join-for-free back-to-all">BACK TO ALL SHOWS</button>
  `;
    bannerMain.style.height = "40vh";
    bannerMain.style.transform = "translateY(120px)";
    document.querySelector(".arrows").style.display = "none";
    let backButton = document.querySelector(".back-to-all");
    backButton.addEventListener("click", () => {
      showAll();
    });
    let getSummary = foundShow._embedded.show.summary;
    function turncate() {
      if(getSummary == null){
        getSummary = "Sorry, summary is unavailable in this moment";
        return getSummary;   
      }
      return getSummary.slice(0, 200)+" ...";
    }
    let genresOutput = "";
    function genresLookUp() {
      if (myShow.genres.length > 0) {
        genresOutput = myShow.genres;
      } else {
        genresOutput = "Genre not found";
      }
    }
    genresLookUp();
    test();
    async function test() {
      try {
        await fetch(`https://api.tvmaze.com/shows/${myShow.id}/cast`)
          .then((resp) => resp.json())
          .then((data) => {
            localStorage.setItem("cast", JSON.stringify(data));
          });
      } finally {
        let castStorage = localStorage.getItem("cast");
        let castObj = JSON.parse(castStorage);

        function test() {
          let outputList=[];
          
          for (let i = 0; i < castObj.length; i++) {
            const person = castObj[i].person
            const character = castObj[i]?.character || {name: ""}
            const path = person?.image?.original || "./img/notfound.png";
            
            outputList += 
            `
            <li class="list-item">${person.name}
            
              <img class="person-image" src="${path}"/>
              <div class="character"> <span>The roll</span><br>${character.name}</div>
              </li>
              `
              
          }
          
          if(!outputList.length){
            outputList += 'Sorry, this information is unavailable in this moment'
          }
          
        
        
          
          console.log(outputList)
          return outputList;
        }

        let output = `
  <div class="card-small" id="${myShow.id}" style="background-image:url(${myShow.image.original})"></div>
  <div class="description-holder">
    <div class="show-description">${turncate()}</div>
    <div class="imdb-holder">
      <a class="imdb-flex" href="http://www.imdb.com/title/${myShow.externals.imdb} 
      "target="_blank"><img class="imdb-img" src="./img/imdb-logo.png"/></a>
    <div class="genres">Genre: <span class="span-genres">${genresOutput}</span></div>
    <div class="language">Language: <span class="span-genres">${myShow.language}</span></div>
    <div class="premiered">Premiered: <span class="span-genres">${myShow.premiered}</span></div>
    <div class="website">Ofiicial website: <a class="span-genres" href="${myShow.officialSite}
    "target="_blank">LINK</a></div>
 


  </div>
  </div>
  <div class="cast-all"><span class="cast-title"> Cast</span> <div class="list">${test()}</div>
  `;

        content.innerHTML = output;
      }
    }
  }
}



showAll();
