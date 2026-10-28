document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const emptyMsg = document.getElementById('empty-msg');
    const countEl = document.getElementById('count');
    const clearBtn = document.getElementById('clear-completed');

    const STORAGE_KEY = 'todo-tasks';

    /* load tasks from localStorage and render them as array(falls back to an empty array*/

    let tasks = (()=>{
        try {
            const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(savedTasks) ? savedTasks : [];
        } catch {
            return [];
        }
    })();

    render(); // Initial render of tasks on page load

    /* a function save the tasks to localStorage */
    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } 



    const newId = () =>
    (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random());
    

    /*--------------RENDER TASKS------------------*/

  function render() {
    list.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      // Checkbox -> mark completed
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'toggle';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task as completed');

      // Task text
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      // Delete button
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'delete-btn';
      del.textContent = 'DEL';
      del.title = 'Delete task';
      del.setAttribute('aria-label', 'Delete task');

      li.append(checkbox, span, del);
      list.appendChild(li);
    });

    emptyMsg.style.display = tasks.length ? 'none' : 'block';

    const remaining = tasks.filter(t => !t.completed).length;
    countEl.textContent = `${remaining} of ${tasks.length} task${tasks.length === 1 ? '' : 's'} remaining`;
    clearBtn.disabled = !tasks.some(t => t.completed);
  }


    /*--------------ADD A TASK------------------*/


  form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) {
            input.focus();
            return;
        }
        tasks.push({ id: newId(), text, completed: false });
        input.value = '';
        input.focus();
        save();
        render();
  });

  /*--------------TOGGLE COMPLETION: handle checkbox change------------------*/


  list.addEventListener('change',e=>{

    if (!e.target.classList.contains('toggle')) return;
    const id = e.target.closest('.todo-item').dataset.id;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = e.target.checked;
    save();
    render();

  })

    /*--------------DELETE A TASK: handle delete button click------------------*/

    list.addEventListener('click', e => {
        if (!e.target.classList.contains('delete-btn')) return;
        const btn = e.target.closest('.delete-btn');
        
        const id = e.target.closest('.todo-item').dataset.id;
        tasks = tasks.filter(t => t.id !== id);
        save();
        render();
    });

    /*--------------CLEAR COMPLETED TASKS------------------*/

    clearBtn.addEventListener('click', () => {
        // Filter out completed tasks: remove all tasks that are marked as completed
        tasks = tasks.filter(t => !t.completed);
        save();
        render();
    });






})