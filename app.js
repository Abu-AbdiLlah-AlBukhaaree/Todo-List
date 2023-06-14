const addItem = document.getElementById('text-input');
const btn = document.querySelector('.add-activity-btn');
const btnRect = btn.getBoundingClientRect();

addItem.style.width = `calc(100% - ${btnRect.width}px)`;

class Todo {
  constructor() {
    this.form = document.querySelector('.form');
    this.textInput = document.getElementById('text-input');
    this.todoList = document.getElementById('todo-list');
    // this.textInputValue = this.textInput.value;
    this.todoActivity = document.querySelector('.todo-activity');

    // select btns
    this.addActivityBtn = document.querySelector('.add-activity-btn');
    this.completedBtn = document.querySelector('.completed');
    this.editBtn = document.querySelector('.edit');
    this.deleteBtn = document.querySelector('.delete');

    // bind methods
    this.addActivity = this.addActivity.bind(this);

    // event listeners
    this.addActivityBtn.addEventListener('click', this.addActivity);
  }

  addActivity() {
    // prevent the default form submission
    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
    });

    // create dynamic article element
    const element = document.createElement('article');
    element.classList.add('todo-activity');
    element.innerHTML = `<p class="todo-activity_text">${this.textInput.value}</p>
            <div class="todo-activity_btns">
              <button class="completed">
                <i class="fas fa-check-double"></i>
              </button>
              <button class="edit"><i class="far fa-edit"></i></button>
              <button class="delete">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>`;

    this.todoList.appendChild(element);
    this.textInput.value = '';
  }
}

const todo = new Todo();
// console.log(todo);
