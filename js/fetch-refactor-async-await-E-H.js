(async function homepageCards() {
    try {
        let movies = await getMovies('movie')
        postUIcards(movies)
    } catch (error) {
        alert(error)
    }
})()

//======================================================================================
let searchButton = document.querySelector('.search-button')
let inputKeyword = document.querySelector('.input-keyword')
searchButton.addEventListener('click', async function() {
    if (inputKeyword.value === '') {
        alert('Please enter a keyword.')
    } else {
        try {
            let movies = await getMovies(inputKeyword.value)
            postUIcards(movies)
        } catch (error) {
            alert(error)
        }
    }
})
inputKeyword.addEventListener('keyup', async function(btn) {
    if (inputKeyword.value === '') {
        alert('Please enter a keyword.')
    } else {
        if (btn.keyCode === 13) {
            try {
                let movies = await getMovies(inputKeyword.value)
                postUIcards(movies)
            } catch (error) {
                alert(error)
            }
        }
    }
})
 
// Event Binding / event delegation = ngasih event ke element yang awalnya blm ada tapi ketika ada, event nya tetap bisa berjalan
// binding event untuk element yang awal nya gak ada, tapi nantinya ADA
// dengan menyimpan event handler ke document (semua element yang ada diweb)
// kalo jquery =
// $('.movie-container').on('click', '.modal-detail-button', function() {
//     console.log($(this).data('imdbid'))
// })

document.addEventListener('click', async function(e){
    try {
        let buttonClass  = 'modal-detail-button'
        if(e.target.classList.contains(buttonClass)) {
            let imdbID = e.target.dataset.imdbid
            let detailMovie = await getDetailMovie(imdbID)
            postModal(detailMovie)
        }
    } catch (error) {
        alert(error)
    }
})

// ketika menggunakan catch, error yang ditangkap oleh fetch yaitu error pada network / url
function getMovies(inputKeyword){
    return fetch('http://www.omdbapi.com/?apikey=ba41c0fc&s=' + inputKeyword)
        .then(result => {
            if(!result.ok){
                throw new Error(result.statusText)
            }
            return result.json()
        })
        .then(result => {
            if(result.Response === 'False') {
                throw new Error(result.Error)
            }
            return result.Search
        })
}

function getDetailMovie(imdbID){
    return fetch('http://www.omdbapi.com/?apikey=ba41c0fc&i=' + imdbID)
        .then(result => {
            if(!result.ok){
                throw new Error(result.statusText)
            }
            return result.json()
        })
        .then(result => {
            if(result.Response === 'False') {
                throw new Error(result.Error)
            }
            return result
        })
}

function postUIcards(movies){
    movies.sort((terlama, terbaru) => terbaru.Year - terlama.Year)
    cards = ''
    movies.forEach(i => cards += showCards(i))
        let movieContainer = document.querySelector('.movie-container')
        movieContainer.innerHTML = cards
}

function postModal(detailMovie){
    let modal = showMovieDetails(detailMovie)
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