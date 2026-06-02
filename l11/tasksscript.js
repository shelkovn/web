// GLOBAL
let todos;
let todoList;
let input;
let currentFilter = 'all';
let currentSort = 'new';

// tasklist ui render
function render() {
    todoList.innerHTML = '';

let filteredTodos = todos.map((todo, index) => ({ ...todo, originalIndex: index }));
    
    if (currentFilter === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (currentFilter === 'active') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    //сортируем отфильтрованный массив
    filteredTodos.sort((a, b) => {
        if (currentSort === 'az') {
            return a.text.localeCompare(b.text, 'ru');
        }
        if (currentSort === 'za') {
            return b.text.localeCompare(a.text, 'ru');
        }
        if (currentSort === 'old') {
            return a.originalIndex - b.originalIndex;
        }
        if (currentSort === 'new') {
            return b.originalIndex - a.originalIndex;
        }
        return 0;
    });

    filteredTodos.forEach((todo) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div class="todo-item">
        <input type="checkbox" class="todo-toggle" ${todo.completed ? 'checked' : ''} data-index="${todo.originalIndex}">
        <div class="task-content">
          <span class="task-text">${todo.text}</span>
          <span class="task-date">${todo.date}</span>
        </div>
        <span class="delete-cross" aria-label="удалить" data-index="${todo.originalIndex}">&times;</span>
      </div>
    `;
        todoList.appendChild(li);
    });
}

// list management
function saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function clearlist() {
    todos = [];
    saveToStorage();
    render();
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    const newTodo = {
        text: text,
        date: new Date().toLocaleDateString('ru-RU'),
        completed: false
    };

    todos.push(newTodo);
    saveToStorage();
    render();
    input.value = '';
}

// list initialization
document.addEventListener('DOMContentLoaded', () => {
    // Присваиваем значения глобальным переменным после загрузки DOM
    todoList = document.querySelector('.todo-list');
    input = document.querySelector('.input-group input');

    const addButton = document.querySelector('.button-cluster button[type="submit"]');
    const resetButton = document.querySelector('.button-cluster button[type="reset"]');
    const filterContainer = document.querySelector('.filter-section');

    todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Обработка кликов 
    todoList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        if (e.target.classList.contains('delete-cross')) {
            todos.splice(index, 1);
            console.log("deleted");
            saveToStorage();
            render();
        } else if (e.target.classList.contains('todo-toggle')) {
            todos[index].completed = e.target.checked;
            saveToStorage();
        }
        // при клике на чекбокс задача должна сразу исчезать из списка
        if (currentFilter !== 'all') {
            render();
        }
    });
    render();

    //переключение фильтров
    filterContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.dataset.filter;
        render();
    });

    // Слушатели событий на кнопки и клавиатуру
    addButton.addEventListener('click', addTodo);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    resetButton.addEventListener('click', clearlist);

    const sortDropdown = document.querySelector('.sort-dropdown');
    
    sortDropdown.addEventListener('click', (e) => {
        if (!e.target.classList.contains('sort-option')) return;

        // Переключаем класс активного элемента
        document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');

        // Сортируем и перерисовываем
        currentSort = e.target.dataset.sort;
        render();
    });
});
