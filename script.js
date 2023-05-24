'use strict'

class Films {
  #data;
  #key = '870c6e64';

  constructor(form, films, fd) {
    this.form = form;
    this.films = films;
    this.filmDetailes = fd;
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
    const apiPromise = fetch(`http://www.omdbapi.com/?apikey=${this.#key}&s=${this.titleSearch.value}&type=${this.selectSearch.value}&page=${page}`);

    apiPromise
      .then(resp => {
        if (resp.ok && resp.status < 400) {
          return resp.json();
        }
        throw '400+'
      })
      .then(resp => {
        _this.successReq(resp);
      })
      .catch((err) => {console.log(err)});
    // $.ajax({
    //   type: "get",
    //   url: 'http://www.omdbapi.com/',
    //   data: {
    //     apikey: this.#key,
    //     s: this.titleSearch.value,
    //     type: this.selectSearch.value,
    //     page: page
    //   },
    //   success: function (response) {
    //     _this.successReq(response);
    //   }
    // });
  }


  requestFilm(id) {
    console.log(1);
    const _this = this;
    const apiPromise = fetch(`http://www.omdbapi.com/?apikey=${this.#key}&i=${id}&plot=full`);

    apiPromise
      .then(resp => {
        if (resp.ok && resp.status < 400) {
          return resp.json();
        }
        throw '400+'
      })
      .then(resp => {
        _this.renderInfo(resp);
      })
      .catch((err) => {console.log(err)});

    // $.ajax({
    //   type: "get",
    //   url: 'http://www.omdbapi.com/',
    //   data: {
    //     apikey: this.#key,
    //     i: id,
    //     plot: 'full'
    //   },
    //   success: function (response) {
    //     _this.renderInfo(response)
    //   }
    // });
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

  renderInfo(data) {
    let htm = `
    <h4>Film info</h4>
    <div class="film-details__content">
      <div class="img-wrapper">
        <img src="${data.Poster}">
      </div>
      <div class="film-data">
        <div class="data-group">
          <div class="title">Title:</div>
          <div class="content">${data.Title}</div>
        </div>
        <div class="data-group">
          <div class="title">Released:</div>
          <div class="content">${data.Released}</div>
        </div>
        <div class="data-group">
          <div class="title">Genre:</div>
          <div class="content">${data.Genre}</div>
        </div>
        <div class="data-group">
          <div class="title">Country:</div>
          <div class="content">${data.Country}</div>
        </div>
        <div class="data-group">
          <div class="title">Director:</div>
          <div class="content">${data.Director}</div>
        </div>
        <div class="data-group">
          <div class="title">Writer:</div>
          <div class="content">${data.Writer}</div>
        </div>
        <div class="data-group">
          <div class="title">Actors:</div>
          <div class="content">${data.Actors}</div>
        </div>
        <div class="data-group">
          <div class="title">Awards:</div>
          <div class="content">${data.Awards}</div>
        </div>
      </div>
    </div>
    `;
    this.filmDetailes.innerHTML = htm;
  }

  refreshPaginator(counts) {
    this.paginator.querySelectorAll('[data-func="num"]').forEach(e => e.remove());
    console.log(counts);
    console.log((Math.ceil(counts / 10)));
    for (let i = 1; i < (Math.ceil(counts / 10)); i++) {
      this.paginator.querySelector('li:last-child').insertAdjacentHTML('beforebegin', `<li data-func="num" ${this.currentPage === i ? 'class="active"' : ''}>${i}</li>`);
    }
  }


  formWorker(ev) {
    if (ev.target.matches('[type=submit]')) {
      ev.preventDefault();
      if (this.titleSearch.value === '') return;
      this.requested();
    }
  }

  showInfo(ev) {
    if (ev.target.matches('button[data-id]')) {
      this.requestFilm(ev.target.dataset.id);
    }
  }
  
  paginatorService(ev) {
    if (ev.target.matches('li[data-func]')) {
      if (ev.target.dataset.func === 'num') {
        this.currentPage = +ev.target.textContent;
      } else if (ev.target.dataset.func === 'prev') {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      } else if (ev.target.dataset.func === 'next') {
        if (this.currentPage < +this.paginator.querySelector('li:nth-last-child(2)').textContent) {
          this.currentPage++;
        }
      }
      this.requested(this.currentPage);
    }
  }

  init() {
    this.form.addEventListener('click', this.formWorker.bind(this));
    this.films.querySelector('.films__content').addEventListener('click', this.showInfo.bind(this));
    this.paginator.addEventListener('click', this.paginatorService.bind(this));
  }
}

const films = new Films(document.querySelector('form.form'), document.querySelector('.films'), document.querySelector('.film-details'));
films.init();

