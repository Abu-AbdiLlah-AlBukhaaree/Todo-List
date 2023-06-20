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
    this.fromLocalStorage = JSON.parse(localStorage.getItem('Activities'));
    // this.store = [];
    // if (this.fromLocalStorage) {
    //   this.store = this.fromLocalStorage;
    // }
    this.store = this.fromLocalStorage || []; // Initialize with existing data or an empty array

    // for edit
    this.editToggle = false;
    this.edittedText = '';
    this.edittedElement = null;
    this.edittedElementId = null;

    // load local storage
    this.updateContentFromLocalStorage();

    // select dynamic btns
    this.completedBtns = document.querySelectorAll('.completed');
    this.editBtns = document.querySelectorAll('.edit');
    this.deleteBtns = document.querySelectorAll('.delete');
    this.dynamicallyCreatedBtns(
      this.completedBtns,
      this.editBtns,
      this.deleteBtns
    );

    // select btns
    this.addActivityBtn = document.querySelector('.add-activity-btn');
    this.clearBtn = document.querySelector('.clear');

    // bind methods
    this.addActivity = this.addActivity.bind(this);
    this.createElementContent = this.createElementContent.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.clearList = this.clearList.bind(this);
    this.dynamicallyCreatedBtns = this.dynamicallyCreatedBtns.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.updateContentFromLocalStorage =
      this.updateContentFromLocalStorage.bind(this);

    // event listeners
    this.addActivityBtn.addEventListener('click', this.addActivity);
    this.clearBtn.addEventListener('click', this.clearList);

    this.toggleClearBtn();

    // update local storage
    this.updateLocalStorage();
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
      this.edittedElement.querySelector('.todo-activity_text').textContent =
        this.edittedText.trim();
      this.editToggle = false;

      // change add button's text back from 'edit' to 'add'
      this.addActivityBtn.value = 'add';

      // re-enabling other buttons
      this.edittedElement.querySelector('.completed').style.color = '#1e791e';
      this.edittedElement.querySelector('.completed').disabled = false;
      this.edittedElement.querySelector('.delete').style.color = '#c80808';
      this.edittedElement.querySelector('.delete').disabled = false;

      // storing the new text
      const id = this.edittedElementId;
      const updated = this.store.find(function (item) {
        return item.id == id;
      });
      updated.content = this.edittedText;

      // show alert
      this.showAlert('activity updated', 'success');
    } else {
      if (this.textInput.value === '') {
        this.showAlert(`activity can't be empty`, 'error');
      } else {
        this.createElementContent(this.textInput.value.trim());

        // show alert
        this.showAlert('activity added', 'success');
      }
    }
    // *** end of add activity ***

    // dynamically selected buttons
    const completedBtns = document.querySelectorAll('.completed');
    const editBtns = document.querySelectorAll('.edit');
    const deleteBtns = document.querySelectorAll('.delete');
    this.dynamicallyCreatedBtns(completedBtns, editBtns, deleteBtns);
    // clear text input
    this.textInput.value = '';

    this.toggleClearBtn();

    // update local storage
    this.updateLocalStorage();
  }

  activityCompleted = (e) => {
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

    // working with local storage
    const currentElementId = currentElementParentElementSibling.dataset.id;
    for (let i = 0; i < this.store.length; i++) {
      if (this.store[i].id == currentElementId) {
        this.store[i].status = 'completed';
        break;
      }
    }

    // update local storage
    this.updateLocalStorage();
  };

  deleteActivity = (e) => {
    const currentElement = e.currentTarget;
    const currentElementArticleParent =
      currentElement.closest('.todo-activity');

    // remove currentElementArticleParent
    currentElementArticleParent.remove();

    // show alert
    this.showAlert('activity removed', 'error');

    this.toggleClearBtn();

    // working with local storage
    const currentElementParentElementSibling =
      currentElement.parentElement.previousElementSibling;
    const currentElementId = currentElementParentElementSibling.dataset.id;
    const store = this.store;
    for (let i = 0; i < this.store.length; i++) {
      if (this.store[i].id == currentElementId) {
        this.store.splice(i, 1);
        break;
      }
    }
    this.updateLocalStorage();
  };

  editActivity = (e) => {
    const currentElement = e.currentTarget;
    const currentElementParentElementSibling =
      currentElement.parentElement.previousElementSibling;
    this.textInput.value = currentElementParentElementSibling.textContent;
    // change add btn value from 'add' to 'edit'
    this.addActivityBtn.value = 'edit';
    this.edittedElement = currentElement.closest('.todo-activity');

    // focus on text input
    this.textInput.focus();

    // disable other buttons when active
    currentElement.previousElementSibling.disabled = true;
    currentElement.previousElementSibling.style.color = 'grey';
    currentElement.nextElementSibling.disabled = true;
    currentElement.nextElementSibling.style.color = 'grey';

    // set toggle
    this.editToggle = true;

    // store dataset.id of the active element
    this.edittedElementId = currentElementParentElementSibling.dataset.id;
  };

  clearList(e) {
    const allTodoActivities = this.todoList.querySelectorAll('.todo-activity');
    allTodoActivities.forEach(function (item) {
      item.remove();
    });

    // show alert
    this.showAlert('list cleared', 'error');

    this.toggleClearBtn();

    // clear local storage
    this.store = [];
    localStorage.clear();
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
    const id = new Date().getTime();
    this.element.innerHTML = `<p class="todo-activity_text" data-id="${id}">${info}</p>
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

    this.store.push({
      id,
      content: this.textInput.value,
      status: 'uncompleted',
    });
    // console.log(this.store);
  }

  dynamicallyCreatedBtns(completedBtns, editBtns, deleteBtns) {
    // concerned methods
    const activityCompleted = this.activityCompleted;
    const deleteActivity = this.deleteActivity;
    const editActivity = this.editActivity;

    // event listeners of dynamic btns
    completedBtns.forEach(function (btn) {
      btn.addEventListener('click', activityCompleted);
    });
    editBtns.forEach(function (btn) {
      btn.addEventListener('click', editActivity);
    });
    deleteBtns.forEach(function (btn) {
      btn.addEventListener('click', deleteActivity);
    });
  }

  showAlert(alertInfo, boolean) {
    const alert = this.alert;
    alert.textContent = alertInfo;
    alert.classList.add(boolean);
    setTimeout(function () {
      alert.classList.remove(boolean);
    }, 1000);
  }

  // ************ LOCAL STORAGE ************
  updateLocalStorage() {
    localStorage.setItem('Activities', JSON.stringify(this.store));
  }

  updateContentFromLocalStorage() {
    const storeActivities = this.fromLocalStorage;

    if (storeActivities && Array.isArray(storeActivities)) {
      const newValue = storeActivities.map(function (item) {
        if (item.status === 'uncompleted') {
          return `<article class="todo-activity">
                <p class="todo-activity_text" data-id="${item.id}">${item.content}</p>
            <div class="todo-activity_btns">
              <button class="completed">
                <i class="fas fa-check-double"></i>
              </button>
              <button class="edit"><i class="far fa-edit"></i></button>
              <button class="delete">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
              </article>`;
        } else {
          return ` <article class="todo-activity">
            <p class="todo-activity_text" data-id="${item.id}" style="text-decoration: line-through">${item.content}</p>
            <div class="todo-activity_btns">
              <button class="completed" disabled="" style="color: grey">
                <i class="fas fa-check-double"></i>
              </button>
              <button class="edit" disabled="" style="color: grey">
                <i class="far fa-edit"></i>
              </button>
              <button class="delete">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </article>`;
        }
      });

      let show = newValue.join('');
      this.todoList.innerHTML = show;
      // console.log(show);
    }
  }
}

const todo = new Todo();
// console.log(todo);
