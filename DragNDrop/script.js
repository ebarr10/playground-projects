const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
// let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter Arrays to Remove Empty Items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.setAttribute('onclick', `makeEditable(${index}, ${column})`);
  // listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  // Append to column
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Make an Item Editable when Double Clicked
function makeEditable(id, column) {
  const selectedColumnEl = listColumns[column].children;
  selectedColumnEl[id].contentEditable = true;
}

// Update Item - Delete if necessary or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!selectedColumnEl[id].textContent) {
    delete selectedArray[id];
  } else {
    selectedArray[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
  // if (!dragging) {
  //   if (!selectedColumnEl[id].textContent) {
  //     delete selectedArray[id];
  //   } else {
  //     selectedArray[id] = selectedColumnEl[id].textContent;
  //   }
  //   updateDOM();
  // }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Add Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  // Typically when you see an empty array and then a for loop, can probably use map function
  // List.children is array-like but not necessarily an array
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);
  updateDOM();
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach(column => {
    column.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  // Dragging Complete
  dragging = false;

  rebuildArrays();
}

// On Load
updateDOM();

