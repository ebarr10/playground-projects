const button = document.getElementById("button");
const dadButton = document.getElementById("dadButton");
const audioElement = document.getElementById("audio");
const jokeText = document.getElementById("joke");

// Disable/Enable Button
function toggleButton() {
  button.disabled = !button.disabled;
  dadButton.disabled = !dadButton.disabled;
}

// Passing Joke to VoiceRSS API
function tellMe(joke) {
  // Displaying Joke
  jokeText.textContent = joke;

  const jokeString = joke.trim().replace(/ /g, "%20");
  VoiceRSS.speech({
    // Normally, don't write out API Keys like this, but an exception made here because it's free.
    key: "e985f868e96c46d9b0789c3855350152",
    src: jokeString,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

async function getDadJoke() {
  toggleButton();
  let joke = "";
  const apiUrl = "https://icanhazdadjoke.com/";
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "text/plain",
      },
    });
    const joke = await response.text();

    // Text-to-Speech
    tellMe(joke);
  } catch (error) {
    console.error(error);
  }
}

// Get Jokes From Joke API
async function getJokes() {
  // Disable Button
  toggleButton();
  let joke = "";
  const apiUrl =
    "https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,racist,sexist";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    // Text-to-Speech
    tellMe(joke);
  } catch (error) {
    console.error(error);
  }
}

// Event Listener
button.addEventListener("click", getJokes);
dadButton.addEventListener("click", getDadJoke);
audioElement.addEventListener("ended", toggleButton);
