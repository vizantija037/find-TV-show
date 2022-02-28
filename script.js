const searchButton = document.getElementById('search-icon');
searchButton.addEventListener('click', ()=>{
  let searchField = document.getElementById('input-search');
  searchField.classList.toggle('inpute-search-active');
  searchButton.classList.toggle('active');
})

document.addEventListener('click', function(e){
  let searchField = document.getElementById('input-search');
  if(e.target===searchField || e.target===searchButton){
    return
  } else {
    console.log('napolju')
    searchField.classList.remove('inpute-search-active');
    searchButton.classList.remove('active');
  }
})

