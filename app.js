const addItem = document.getElementById('text-input');
const btn = document.querySelector('.add-activity-btn');
const btnRect = btn.getBoundingClientRect();

addItem.style.width = `calc(100% - ${btnRect.width}px)`;

class Todo {
  constructor() {
    this.alert = document.querySelector('.alert');
    this.form = document.querySelector('.form');
    this.textInput = document.getElementById('text-input');
    this.todoList = document.getElementById('todo-list');
    this.todoActivity = document.querySelector('.todo-activity');

    // for edit
    this.editToggle = false;
    this.edittedText = '';
    this.edittedElement = null;

    // select btns
    this.addActivityBtn = document.querySelector('.add-activity-btn');
    this.clearBtn = document.querySelector('.clear');

    // bind methods
    this.addActivity = this.addActivity.bind(this);
    this.activityCompleted = this.activityCompleted.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.editActivity = this.editActivity.bind(this);
    this.createElementContent = this.createElementContent.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.clearList = this.clearList.bind(this);

    // event listeners
    this.addActivityBtn.addEventListener('click', this.addActivity);
    this.clearBtn.addEventListener('click', this.clearList);

    this.toggleClearBtn();
  }

  addActivity() {
    // prevent the default form submission
    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
    });

    // *** add activity ***
    if (this.editToggle) {
      // this block of code is solely for editing
      this.edittedText = this.textInput.value;
      this.edittedElement.firstChild.textContent = this.edittedText;
      this.editToggle = false;

      // change add button's text back from 'edit' to 'add'
      this.addActivityBtn.value = 'add';

      // show alert
      this.showAlert('activity updated', 'success');
    } else {
      if (this.textInput.value === '') {
        this.showAlert(`activity can't be empty`, 'error');
      } else {
        this.createElementContent(this.textInput.value);

        // show alert
        this.showAlert('activity added', 'success');
      }
    }
    // *** end of add activity ***

    // clear text input
    this.textInput.value = '';

    // select dynamic btns
    const completedBtn = document.querySelectorAll('.completed');
    const editBtn = document.querySelectorAll('.edit');
    const deleteBtn = document.querySelectorAll('.delete');

    // concerned methods
    const activityCompleted = this.activityCompleted;
    const deleteActivity = this.deleteActivity;
    const editActivity = this.editActivity;

    // event listeners of dynamic btns
    completedBtn.forEach(function (btn) {
      btn.addEventListener('click', activityCompleted);
    });
    deleteBtn.forEach(function (btn) {
      btn.addEventListener('click', deleteActivity);
    });
    editBtn.forEach(function (btn) {
      btn.addEventListener('click', editActivity);
    });

    this.toggleClearBtn();
  }

  activityCompleted(e) {
    const currentElement = e.currentTarget;
    const currentElementParentElementSibling =
      currentElement.parentElement.previousElementSibling;
    currentElementParentElementSibling.style.textDecoration = 'line-through';
    currentElement.style.color = 'grey';

    // changing buttons condition
    const todoActivity = currentElement.closest('.todo-activity');
    const editBtn = todoActivity.querySelector('.edit');
    editBtn.style.color = 'grey';
    editBtn.disabled = true;
    currentElement.disabled = true;

    // show alert
    this.showAlert('activity completed', 'success');
  }

  deleteActivity(e) {
    const currentElement = e.currentTarget;
    const currentElementArticleParent =
      currentElement.closest('.todo-activity');

    // remove currentElementArticleParent
    currentElementArticleParent.remove();

    // show alert
    this.showAlert('activity removed', 'error');

    this.toggleClearBtn();
  }

  editActivity(e) {
    const currentElement = e.currentTarget;
    const currentElementParentElementSibling =
      currentElement.parentElement.previousElementSibling;
    this.textInput.value = currentElementParentElementSibling.textContent;
    // change add btn value from 'add' to 'edit'
    this.addActivityBtn.value = 'edit';
    this.edittedElement = currentElement.closest('.todo-activity');

    // set toggle
    this.editToggle = true;
  }

  clearList(e) {
    const allTodoActivities = this.todoList.querySelectorAll('.todo-activity');
    allTodoActivities.forEach(function (item) {
      item.remove();
    });

    // show alert
    this.showAlert('list cleared', 'error');

    this.toggleClearBtn();
  }

  toggleClearBtn() {
    if (this.todoList.children.length > 0) {
      this.clearBtn.style.display = 'inline';
    } else {
      this.clearBtn.style.display = 'none';
    }
  }

  createElementContent(info) {
    // create dynamic article element
    this.element = document.createElement('article');
    this.element.classList.add('todo-activity');
    this.element.innerHTML = `<p class="todo-activity_text">${info}</p>
            <div class="todo-activity_btns">
              <button class="completed">
                <i class="fas fa-check-double"></i>
              </button>
              <button class="edit"><i class="far fa-edit"></i></button>
              <button class="delete">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>`;
    this.todoList.appendChild(this.element);
  }

  showAlert(alertInfo, boolean) {
    const alert = this.alert;
    alert.textContent = alertInfo;
    alert.classList.add(boolean);
    setTimeout(function () {
      alert.classList.remove(boolean);
    }, 1000);
  }
}

const todo = new Todo();
// console.log(todo);
