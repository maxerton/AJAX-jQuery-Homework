'use strict'

class Films {
  #data;
  #key = '870c6e64';

  constructor(form, films) {
    this.form = form;
    this.films = films;
    this.titleSearch = this.form.querySelector('input[data-name=title]');
    this.selectSearch = this.form.querySelector('select[data-name=type]');
    this.filmsContent = this.films.querySelector('.films__content');
    this.paginator = this.films.querySelector('ul.paginator');
    this.currentPage = 1;
  }

  renderNewFilm(element) {
    const htm = `
    <div class="film">
      <div class="img__wrapper">
        <img src="${element.Poster === "N/A" ? 'https://placehold.co/300x420/png' : element.Poster}">
      </div>
      <div class="film__content">
        <div class="type">${element.Type}</div>
        <div><h4>${element.Title}</h4></div>
        <div class="year">${element.Year}</div>
        <button data-id="${element.imdbID}">Details</button>
      </div>
    </div>
    `;
    this.filmsContent.insertAdjacentHTML('beforeend', htm);
  }

  renderData() {
    this.filmsContent.innerHTML = '';
    console.dir(this.#data);
    for (let i = 0; i < this.#data.length; i++) {
      this.renderNewFilm(this.#data[i]);
    }
  }

  requested(page = 1) {
    console.log(1);
    const _this = this;
    $.ajax({
      type: "get",
      url: 'http://www.omdbapi.com/',
      data: {
        apikey: this.#key,
        s: this.titleSearch.value,
        type: this.selectSearch.value,
        page: page
      },
      success: function(request) {
        console.dir(this);
        _this.successReq(request);
      }
    });
  }

  successReq(response) {
    if (response.Response === "Error") {
      alert(response);
    } else if (response.Response === 'True') {
      this.#data = response.Search;
      this.renderData();
      this.refreshPaginator(+response.totalResults);
    }
  }

  refreshPaginator(counts) {
    this.paginator.querySelectorAll('[data-func="num"]').forEach(e => e.remove());
    console.log(counts);
    console.log((Math.ceil(counts / 10)));
    for (let i = 1; i < (Math.ceil(counts / 10)); i++) {
      console.log(i);
      this.paginator.querySelector('li:last-child').insertAdjacentHTML('beforebegin', `<li data-func="num">${i}</li>`);
    }
  }

  //{"Search":[{"Title":"Ocean Waves","Year":"1993","imdbID":"tt0108432","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BNDkzODhjMTktOTkwZS00MGQ3LTg4MGUtMDA5NWI2Y2ZiMzhjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"},{"Title":"The Deep End of the Ocean","Year":"1999","imdbID":"tt0120646","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BODVhNDEyYzktMmU2Ni00NzlkLTg0NWQtYmEzYTg4MDliOWQ3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg"},{"Title":"A Plastic Ocean","Year":"2016","imdbID":"tt5203824","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTk5MTU0MTA2OF5BMl5BanBnXkFtZTgwMzQ3MjQ5MDI@._V1_SX300.jpg"},{"Title":"Ocean Heaven","Year":"2010","imdbID":"tt1498858","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjMyNDk5ODgxM15BMl5BanBnXkFtZTgwODQ4NjI2MDE@._V1_SX300.jpg"},{"Title":"711 Ocean Drive","Year":"1950","imdbID":"tt0042176","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMzE0OWEyNjAtM2QyNS00MDk5LWI1ZGQtNjU0NjVmZjg2OTRmXkEyXkFqcGdeQXVyNTk1MTk0MDI@._V1_SX300.jpg"},{"Title":"Planet Ocean","Year":"2012","imdbID":"tt2240784","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BOGFkZjdjYjEtN2NmOS00NWJkLWJmZWItM2Q2NTBmY2UzYWRjXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"},{"Title":"Monster from the Ocean Floor","Year":"1954","imdbID":"tt0047244","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BN2U3YmIxMTMtOTNjMy00MGZlLWJhMGEtNzM3NzM5ZWFiZTVlXkEyXkFqcGdeQXVyNjQzNDI3NzY@._V1_SX300.jpg"},{"Title":"Ocean Boy","Year":"2022","imdbID":"tt11898882","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BY2I1ZTZlYmQtZjZiYS00ZWIzLWJmMjEtMWY2ZmExZGE0N2NhXkEyXkFqcGdeQXVyNTEwNjM1MjE@._V1_SX300.jpg"},{"Title":"The Ocean Waif","Year":"1916","imdbID":"tt0004413","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMzYwNTQ5YzYtNjA5Zi00MzI4LWI2NDAtYjU1NDYyNThlNmYyXkEyXkFqcGdeQXVyNjA5MTAzODY@._V1_SX300.jpg"},{"Title":"Ocean of Pearls","Year":"2008","imdbID":"tt0871438","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTQ2ODYwNjUwMF5BMl5BanBnXkFtZTcwOTc5OTc0Mg@@._V1_SX300.jpg"}],"totalResults":"591","Response":"True"}

  formWorker(ev) {
    if (ev.target.matches('[type=submit]')) {
      ev.preventDefault();
      if (this.titleSearch.value === '') return;
      this.requested();
    }
  }

  init() {
    this.form.addEventListener('click', this.formWorker.bind(this));
    // this.form.addEventListener('submit', this.formWorker.bind(this));
    // console.log('123')
    console.dir(this.films.querySelector('.films__content'));
  }
}
$(document).ready(function () {
  const films = new Films(document.querySelector('form.form'), document.querySelector('.films'));
  films.init();
})

