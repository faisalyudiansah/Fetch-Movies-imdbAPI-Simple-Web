(function homePage() {
    return fetchData('movie')
})()

let searchButton = document.querySelector('.search-button')
let inputKeyword = document.querySelector('.input-keyword')
searchButton.addEventListener('click', function() {
    return fetchData(inputKeyword.value)
})
inputKeyword.addEventListener('keyup', function (btn) {
    if (btn.keyCode === 13) {
        fetchData(inputKeyword.value)
    }
})

function fetchData(inputKeyword) {
    if (inputKeyword === '') {
        alert('Please enter a keyword.')
    } else {
        fetch('http://www.omdbapi.com/?apikey=ba41c0fc&s=' + inputKeyword)
            .then(result => result.json())
            .then(result => {
                if (result.Response === 'False') {
                    alert(result.Error)
                } else {
                    let movies = result.Search
                    return postUIcards(movies)
                }
            })
            .catch(error => alert(error))
    }
}

function getDetailMovie() {
    let detailModal = document.querySelectorAll('.modal-detail-button')
    detailModal.forEach(btn => {
        btn.addEventListener('click', function () {
            let imdbID = this.dataset.imdbid
            fetch('http://www.omdbapi.com/?apikey=ba41c0fc&i=' + imdbID)
                .then(result => result.json())
                .then(result => {
                    let modal = showMovieDetails(result)
                    return postModal(modal)                    
                })
        })
    })
}

function postUIcards(movies) {
    let cards = ''
    movies.sort((terlama, terbaru) => terbaru.Year - terlama.Year)
    movies.forEach(i => cards += showCards(i))
    let movieContainer = document.querySelector('.movie-container')
    movieContainer.innerHTML = cards
    getDetailMovie()
}

function postModal(modal) {
    let movieModal = document.querySelector('.movie-modal')
    movieModal.innerHTML = modal
    // close modal with enter
    document.addEventListener('keyup', function(btn) {
        if (btn.keyCode === 13) {
            let closeButton = document.querySelector('.btn[data-bs-dismiss="modal"]')
            closeButton.click()
        }
    })
}

function showCards(i) {
    return `<div class="col-md-3 my-4">
                <div class="card h-100">
                    <img src="${i.Poster}" class="card-img-top h-100">
                    <div class="card-body">
                        <h5 class="card-title">${i.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${i.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button mt-3" data-bs-toggle="modal" data-bs-target="#modalMovieDetails" data-imdbid="${i.imdbID}">Show details</a>
                    </div>
                </div>
            </div>`
}

function showMovieDetails(result) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${result.Poster}" class="img-fluid">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${result.Title}</h4></li>
                            <li class="list-group-item"><strong>Director : </strong>${result.Director}</li>
                            <li class="list-group-item"><strong>Actors : </strong>${result.Actors}</li>
                            <li class="list-group-item"><strong>Writer : </strong>${result.Writer}</li>
                            <li class="list-group-item"><strong>Genre : </strong>${result.Genre}</li>
                            <li class="list-group-item"><strong>Plot : </strong><br>${result.Plot}</li>
                            <li class="list-group-item"><strong>Runtime : </strong><br>${result.Runtime}</li>
                            <li class="list-group-item"><strong>Language : </strong><br>${result.Language}</li>
                            <li class="list-group-item"><strong>imdb Rating : </strong><br>${result.imdbRating}</li>
                            <li class="list-group-item"><strong>Ratings : </strong><br>${result.Ratings.map(o => {
        return `<ul>
                                            <li>${o.Source} = ${o.Value}</li>
                                        </ul>`
    }).join('')}</li>
                        </ul>
                    </div>
                </div>
            </div>`
}