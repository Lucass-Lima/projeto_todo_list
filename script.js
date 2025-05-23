//SELEÇAO DE ELEMENTOS
const todoForm = document.querySelector("#todo_form");
const todoInput = document.querySelector("#todo_input");
const todoList = document.querySelector("#todo_list");
const editForm = document.querySelector("#edit_form");
const editInput = document.querySelector("#edit_input");
const cancelBtn = document.querySelector("#btn_cancel");
const searchInput = document.querySelector("#search_input");
const eraseBtn = document.querySelector("#btn_erase");
const filterBtn = document.querySelector("#filter_select");

let oldInputValue;

//FUNÇOES------------
//FUNÇAO PARA ADICIONAR UMA NOVA TAREFA
const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish_todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit_todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove_todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    //UTILIZANDO OS DADOS DO LOCAL STORAGE
    if(done) todo.classList.add("done");
    
    if(save) saveTodoLocalStorage({text, done});

    todoList.appendChild(todo)

    todoInput.value = "";
    todoInput.focus();
}

//FUNÇAO PARA ALTERNAR ENTRE O MODO DE EDIÇAO E A PAGINA ORIGINAL
const toggleForms = () => {
    
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

//FUNÇAO PARA EDITAR O TITULO DA LISTA
const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue) {

            todoTitle.innerText = text;
            updadeTodoLocalStorage(oldInputValue, text)
        }
    })
} 

//FUNÇAO PARA BUSCAR UMA TAREFA PELAS LETRAS DIGITADAS
const getSearchTodo = (search) => {
    
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)) {

            todo.style.display = "none";
        }
    })
}

//FUNÇAO PARA FILTRAR ENTRE AS TAREFAS (TODAS/FEITAS/A FAZER)
const filterTodos = (filterValue) => {

    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {

        case "all":

            todos.forEach((todo) => (todo.style.display = "flex"));
            
            break;

        case "done":
            
            todos.forEach((todo) => 
                todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) => 
                !todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none")
            )
            break;

        default:
            break;
    }
}

//EVENTOS------------
//EVENTO DO BOTAO PARA ADICIONAR TAREFA
todoForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {

        saveTodo(inputValue);
    }
})

//EVENTO PARA OS BOTOES DA LISTA
document.addEventListener("click", (e) => {

    const targetElement = e.target;
    const parentElement = targetElement.closest("div");

    let todoTitle;

    if(parentElement && parentElement.querySelector("h3")) {

        todoTitle = parentElement.querySelector("h3").innerText;
    }

    //BOTAO DE CONCLUIR TAREFA
    if(targetElement.classList.contains("finish_todo")) {

        updadeTodoStatusLocalStorage(todoTitle);
        parentElement.classList.toggle("done");
    }

    //BOTAO PARA EDITAR UMA TAREFA
    if(targetElement.classList.contains("edit_todo")) {

        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    //BOTAO PARA REMOVER UMA TAREFA
    if(targetElement.classList.contains("remove_todo")) {

        removeTodoLocalStorage(todoTitle);
        parentElement.remove();
    }
})

//EVENTO PARA CANCELAR A EDIÇÃO DE UMA TAREFA
cancelBtn.addEventListener("click", (e) => {

    e.preventDefault();
    toggleForms();
})

//EVENTO PARA CONCLUIR A EDIÇAO DE UMA TAREFA
editForm.addEventListener("submit", (e) => {

    e.preventDefault();
    
    const editInputValue = editInput.value;

    if(editInputValue) {

        updateTodo(editInputValue);
    }

    toggleForms()
})

//EVENTO PARA FAZER UMA BUSCA NAS TAREFAS
searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    getSearchTodo(search);
})

//EVENTO PARA APAGAR O TEXTO DO CAMPO DE PESQUISA
eraseBtn.addEventListener("click", (e) => {

    e.preventDefault();

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
})

//EVENTO PARA O SELECT DE MUDANÇA DE OPÇOES
filterBtn.addEventListener("change", (e) => {

    const filterValue = e.target.value;

    filterTodos(filterValue);
})

//LOCAL STORAGE--------------
//PEGANDO DOS DADOS DO LOCAL STORAGE
const getTodosLocalStorage = () => {

    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;
}

//CARREGANDO OS DADOS DO LOCAL STORAGE
const loadTodos = () => {

    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    })
}

//SALVANDO OS DADOS NO LOCAL STORAGE
const saveTodoLocalStorage = (todo) => {

    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

//REMOVENDO OS DADOS DO LOCAL STORAGE
const removeTodoLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

//ATUALIZANDO DADOS DO LOCAL STORAGE
const updadeTodoStatusLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

//ATUALIZANDO DADOS DO LOCAL STORAGE
const updadeTodoLocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? todo.text = todoNewText : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();