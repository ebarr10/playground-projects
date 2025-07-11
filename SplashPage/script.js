const { body } = document;
// Same as doing: const body = document.body;

// Exploring Memory Leaking
let count = 0;
const ourMemory = {
    [count]: Array(10000).fill('*')
}

// Original Code
function originalChangeBackground(number) {
    // Exploring Memory Leaking
    count++;
    ourMemory[count] = Array(10000).fill('*');

    // Check if background is already showing
    let previousBackground;
    if (body.className) {
        previousBackground = body.className;
    }

    // Reset CSS class for body
    body.classList = ''
    switch (number) {
        case '1':
            return (previousBackground === 'background-1' ? false : body.classList.add("background-1"));
        case '2':
            return (previousBackground === 'background-2' ? false : body.classList.add("background-2"));
        case '3':
            return (previousBackground === 'background-3' ? false : body.classList.add("background-3"));
        default:
            break;
    }
}

// Modified Functionality
function changeBackground(number) {
    return (body.className === `background-${number}` ? changeClassList() : changeClassList(`background-${number}`));
}

function changeClassList(background="") {
    // Reset CSS class for body
    body.classList = background;
}
