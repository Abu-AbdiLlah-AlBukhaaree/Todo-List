const addItem = document.getElementById('add-item');
const btn = document.querySelector('.add-activity');
const btnRect = btn.getBoundingClientRect();

addItem.style.width = `calc(100% - ${btnRect.width}px)`;
