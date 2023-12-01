
var time = new Date().getTime()
console.log(time)

var hash = CryptoJS.MD5(time + "af2bfa5e8b8999a6887a51f054f4bc539e814945" + "b5cfe2a57cc83be0cb757b07557c487e").toString();
console.log(hash)

function marvelAPI() {

    fetch("https://gateway.marvel.com/v1/public/characters?ts=" + time + "&apikey=b5cfe2a57cc83be0cb757b07557c487e&hash=" + hash)
        // fetch(`http://gateway.marvel.com/v1/public/comics?ts=${time}&apikey=b5cfe2a57cc83be0cb757b07557c487e&hash=af2bfa5e8b8999a6887a51f054f4bc539e814945`)
        .then(response => {
            return response.json()
        })
        .then(locRes => {
            // resultTextEl.textContent = locRes.search.query;
            console.log(locRes);
            var results = locRes.data.results

            // resultContentEl.textContent = "";
            for (var i = 0; i < results.length; i++) {
                console.log(results[i]);
                var name = results[i].name;
                var description = results[i].description;
                var thumbnail = results[i].thumbnail.path + '.' + results[i].thumbnail.extension;
                var nameContentEl = document.createElement('h3');
                var descriptionContentEl = document.createElement('P');
                var thumbnailImgEl = document.createElement('img');
                var textBody = document.getElementById('textBox');
                textBody.appendChild(nameContentEl);
                nameContentEl.innerText = "name: " + name;
                textBody.appendChild(descriptionContentEl);
                descriptionContentEl.innerText = "description: " + description;
                textBody.appendChild(thumbnailImgEl);
                thumbnailImgEl.src = thumbnail;
                thumbnailImgEl.style.width='50%';

            }

        })
}

marvelAPI()

var baseWiki = 'https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=&limit=10';
var baseUrl = 'https://api.wikimedia.org/core/v1/wikipedia/en/page/bare';

// an array to hold search history in localStorage to recall later
var searchHistory = [];
var key;

function getWiki(event) {
    event.preventDefault()
    // grabs the value of searchFld if it isn't blank and puts it into the API urls 
    var searchName = document.getElementById('searchFld').value;

    // grabs the html elements that are populated and then empties them so it can repopulate them
    var textBody = document.getElementById('textBox');
    textBody.innerHTML = '';

    if (searchName !== '') {
        var wikiAPI = 'https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=' + searchName + '&limit=10';

        // grabs the API response and pulls the important datapoints
        fetch(wikiAPI)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(wikiAPI);
                // checks if the description in the data has "marvel" in it in order to pick out the desired objects and grabs the key data point

                // var superHeader = document.getElementById('supHead');
                // superHeader.textContent = title;

                var hasMarvel = false;

                for (var i = 0; i < data.pages.length; i++) {
                    var description = data.pages[i].description;
                    console.log(description);
                    if (description.includes("Marvel" && "Comics")) {
                        
                        key = data.pages[i].key;
                        hasMarvel = true;
                        break
                    }
                }
                if (!hasMarvel) {
                    var noChar = document.createElement('p');
                    noChar.innerText = 'Unless you misspelled the name, that is not a Marvel Character';
                    document.getElementById('textBox').appendChild(noChar);
                } else {
                    // runs getURL with the acquired key to displayed the desired information and then saves it to a history in localStorage
                    getURL(key);
                    addSearchToHistory(key);
                    updateSearchHistoryDisplay();
                }
            });
    }
}

// having the key from getWiki, the function is able to display the desired information on the page
function getURL(key) {
    console.log(key);
    var urlAPI = 'https://api.wikimedia.org/core/v1/wikipedia/en/page/' + key + '/bare';

    fetch(urlAPI)
        .then(response => {
            return response.json()
        })
        .then(function (data) {
            var url = data.html_url;
            var textBody = document.getElementById('textBox');

            var link = document.createElement('a');

            link.href = url;
            link.textContent = "Link to Wikipedia page";

            textBody.appendChild(link);
        })
}

// adds searched terms to a history array in order to recall previously searched terms
function addSearchToHistory(key) {
    if (!searchHistory.includes(key)) {
        searchHistory.unshift(key);

        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// turns the elements form the search history array into buttons
function updateSearchHistoryDisplay() {
    var historyDiv = document.getElementById('searchHistory');
    historyDiv.innerHTML = '';

    var historyContainer = document.createElement('div');
    historyContainer.classList.add('mt-2');

    for (var i = 0; i < searchHistory.length; i++) {
        var searchBtn = document.createElement('button');
        searchBtn.textContent = searchHistory[i];
        searchBtn.classList.add('btn', 'btn-primary', 'mb-2');
        searchBtn.style.margin = '5px';

        (function (key) {
            searchBtn.addEventListener('click', function (event) {
                event.preventDefault()
                var textBody = document.getElementById('textBox');
                textBody.innerHTML = '';
                getURL(key);
            });
        })(searchHistory[i]);

        historyContainer.appendChild(searchBtn);
    }
    historyDiv.appendChild(historyContainer);
}

// adds the items from localStorage to the page on reload
document.addEventListener('DOMContentLoaded', function () {
    var storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
        searchHistory = JSON.parse(storedSearchHistory);
        updateSearchHistoryDisplay();
    }
});


// adds event listener to the search button to run getWiki
document.getElementById('searchBtn').addEventListener('click', function(event) {
    getWiki(event);
});

// adds event listener and function to clear the searchFld on click
document.getElementById('searchFld').addEventListener('click', function () {
    document.getElementById('searchFld').value = '';
})

// this code here is used for the search button
// var searchButton = document.querySelector('#characterSearchForm')

// function searchFormSubmit(event) {
//     event.preventDefault();

//     var searchInputValue = document.querySelector('#characterSearch').value;

//     if (!searchInputValue) {
//         console.error('You need a character to search!');
//         return;
//     }
// }
