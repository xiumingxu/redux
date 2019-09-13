function generateId() {
	return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}
const store = Redux.createStore(app);

// store.subscribe(() => {
//   console.log("The new state is:", store.getState());
// });

// unsubscibe the listener repush all the listeners
// whenever subscribe, there is a repush of all the listeners.
const unsubscribe = store.subscribe(() => {
	console.log('The store changed.');
});

// unsubscribe();

// App Code
// reducer : state, action
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return state.concat([ action.todo ]);
		case REMOVE_TODO:
			return state.filter((todo) => todo.id !== action.id);
		case TOGGLE_TODO:
			return state.map(
				(todo) => (todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete }))
			);
		default:
			return state;
	}
}

function goals(state = [], action) {
	switch (action.type) {
		case ADD_GOAL:
			return state.concat([ action.goal ]);
		case REMOVE_GOAL:
			return state.filter((goal) => goal.id !== action.id);
		default:
			return state;
	}
}

function app(state = {}, action) {
	return {
		todos : todos(state.todos, action),
		goals : goals(state.goals, action)
	};
}

store.subscribe(() => {
	console.log('The new state is: ', store.getState());
});

// make clean dispatch
function addTodoAction(todo) {
	return {
		type : ADD_TODO,
		todo
	};
}

function removeTodoAction(id) {
	return {
		type : REMOVE_TODO,
		id
	};
}

function toggleTodoAction(id) {
	return {
		type : TOGGLE_TODO,
		id
	};
}

function addGoalAction(goal) {
	return {
		type : ADD_GOAL,
		goal
	};
}

function removeGoalAction(id) {
	return {
		type : REMOVE_GOAL,
		id
	};
}

store.dispatch(
	addGoalAction({
		id   : 1,
		name : 'Lose 20 pounds'
	})
);
// add dom function
function addTodo() {
	const input = document.getElementById('todo');
	const name = input.value;
	input.value = '';

	// use the dispatch to react to the action
	const todoAction = addTodoAction({
		name,
		complete : false,
		id       : generateId()
	});
	store.dispatch(todoAction);

	addTodoToDOM(todoAction);
}

function addTodoToDOM(todo) {
	const node = document.createElement('li');
	const text = document.createTextNode(todo.name);
	node.appendChild(text);
	node.style.textDecoration = todo.complete ? 'line-through' : 'none';
	node.addEventListener('click', () => {
		store.dispatch(toggleTodoAction(todo.id));
	});
	document.getElementById('todos').appendChild(node);
}
function addGoalToDOM(goal) {
	const node = document.createElement('li');
	const text = document.createTextNode(goal.name);
	node.appendChild(text);
	document.getElementById('goals').append(node);
}

// document.getElementById("todoBtn").onclick(addTodo);
document.getElementById('todoBtn').addEventListener('click', addTodo);
// document.getElementById("goalBtn").addEventListener("click", addGoal);
