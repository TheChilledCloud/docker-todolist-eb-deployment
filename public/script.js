class TodoApp {
    constructor() {
        this.todos = [];
        this.initializeElements();
        this.bindEvents();
        this.loadTodos();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.totalTodos = document.getElementById('totalTodos');
        this.completedTodos = document.getElementById('completedTodos');
        this.pendingTodos = document.getElementById('pendingTodos');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.error.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message = 'Something went wrong. Please try again.') {
        this.error.classList.remove('hidden');
        this.error.querySelector('p').textContent = message;
        this.hideLoading();
    }

    hideError() {
        this.error.classList.add('hidden');
    }

    async apiRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async loadTodos() {
        try {
            this.showLoading();
            this.hideError();
            
            const todos = await this.apiRequest('/api/todos');
            this.todos = todos;
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            this.showError('Failed to load todos. Please refresh the page.');
        } finally {
            this.hideLoading();
        }
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        
        if (!text) {
            this.todoInput.focus();
            return;
        }

        try {
            this.addBtn.disabled = true;
            this.addBtn.textContent = 'Adding...';
            this.hideError();

            const newTodo = await this.apiRequest('/api/todos', {
                method: 'POST',
                body: JSON.stringify({ text })
            });

            this.todos.unshift(newTodo);
            this.todoInput.value = '';
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            this.showError('Failed to add todo. Please try again.');
        } finally {
            this.addBtn.disabled = false;
            this.addBtn.textContent = 'Add';
        }
    }

    async toggleTodo(id, completed) {
        try {
            const updatedTodo = await this.apiRequest(`/api/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ completed })
            });

            const index = this.todos.findIndex(todo => todo._id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
            }

            this.renderTodos();
            this.updateStats();
        } catch (error) {
            this.showError('Failed to update todo. Please try again.');
            // Revert the UI change
            this.renderTodos();
        }
    }

    async deleteTodo(id) {
        try {
            await this.apiRequest(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            this.todos = this.todos.filter(todo => todo._id !== id);
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            this.showError('Failed to delete todo. Please try again.');
        }
    }

    renderTodos() {
        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            this.todoList.appendChild(todoItem);
        });
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo._id;

        const checkbox = document.createElement('div');
        checkbox.className = `todo-checkbox ${todo.completed ? 'checked' : ''}`;
        checkbox.addEventListener('click', () => {
            this.toggleTodo(todo._id, !todo.completed);
        });

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this todo?')) {
                this.deleteTodo(todo._id);
            }
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        return li;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        this.totalTodos.textContent = `Total: ${total}`;
        this.completedTodos.textContent = `Completed: ${completed}`;
        this.pendingTodos.textContent = `Pending: ${pending}`;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});