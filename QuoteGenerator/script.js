const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById("loader");

let apiQuotes = [];


// Show Loading
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading
function removeLoadingSpinner() {
    quoteContainer.hidden = false;
    loader.hidden = true;
}


// Show new Quote
function newQuote() {
    showLoadingSpinner();
    // Pick a random quote form apiQuotes array
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    
    // Check the quote length to determine styling
    if (quote.text.length > 120) {
        quoteText.classList.add('long-quote');
    }
    else {
        quoteText.classList.remove('long-quote');
    }
    quoteText.textContent = quote.text;

    // Check if author field is blank and replace with 'Unknown'
    if (!quote.author) {
        authorText.textContent = 'Unknown';
    }
    else {
        authorText.textContent = quote.author;
    }
    // Set Quote, Hide Loader
    removeLoadingSpinner();
}


// Get Quotes From API
async function getQuotes(timesRan) {
    showLoadingSpinner();
    // proxyUrl for quick solution against a cors error 
    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    $.ajax({
        type: 'GET',
        // url: proxyUrl + apiUrl,
        url: apiUrl,
        dataType: 'json',
        success: function (data) {
            apiQuotes = data;
            newQuote();
        },
        error: function (error) { 
            if(timesRan < 10) {
                console.error(error);
                getQuotes(timesRan++);
            }
            else {
                console.error("Failed to retieve any quotes!");
            }
        }
    })
}


// Tweet Quote
function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, "_blank");
}


// Event Listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);


// On Load
getQuotes(0);