//helper function
function generateId() {
	return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}

// App Code
// @ts-ignore
const ADD_TODO = 'ADD_TODO';
// @ts-ignore
const REMOVE_TODO = 'REMOVE_TODO';
// @ts-ignore
const TOGGLE_TODO = 'TOGGLE_TODO';
// @ts-ignore
const ADD_GOAL = 'ADD_GOAL';
// @ts-ignore
const REMOVE_GOAL = 'REMOVE_GOAL';

const RECEIVE_DATA = 'RECEIVE_DATA';

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

// function loading(state = true, action) {
// 	if (action.type === RECEIVE_DATA) return false;
// 	else return state;
// }

function loading(state, action) {
	if (action.type === RECEIVE_DATA) return false;
	else return true;
}
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
		case RECEIVE_DATA:
			return action.todos;
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
		case RECEIVE_DATA:
			return action.goals;
		default:
			return state;
	}
}

//root reducer

/**
 * This practice could be improved by ES6
 */
// function checker(store) {
//   return function (next) {
//     return function (action) {
//       if (action.type === ADD_TODO &&
//         action.todo.name.toLowerCase().includes('bitcoin')) {
//         return alert('Nope. That is a bad idea.');
//       }
//       if (action.type === ADD_GOAL &&
//         action.goal.name.toLowerCase().includes('bitcoin')) {
//         return alert('Nope. That is a bad idea.');
//       }
//       return next(action);
//     }
//   }
// }
// next is dispatched

function receiveDataAction(todos, goals) {
	return {
		type  : RECEIVE_DATA,
		todos,
		goals
	};
}

const checker = (store) => (next) => (action) => {
	if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('bitcoin')) {
		return alert('Nope. That is a bad idea.');
	}
	if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('bitcoin')) {
		return alert('Nope. That is a bad idea.');
	}
	return next(action);
};

const logger = (store) => (next) => (action) => {
	console.group(action.type);
	console.log('The action: ', action);
	const result = next(action);
	console.log('The new state: ', store.getState());
	console.groupEnd();
	return result;
};

const thunk = (store) => (next) => (action) => {
	if (typeof action === 'function') {
		return action(store.dispatch);
	}
	return next(action);
};

// @ts-ignore
const store = Redux.createStore(
	// @ts-ignore
	Redux.combineReducers({
		todos,
		goals,
		loading
	}),
	// @ts-ignore
	Redux.applyMiddleware(checker, logger, thunk)
);

/* This practice need to*/
// function checkAndDispatch(store, action) {
//   if (action.type === ADD_TODO && action.todo.name.lowerCase().includes('bitcoin')) {
//     return alert('Nope, that is a bad idea');
//   }
//   if (action.type === ADD_GOAL && action.goal.name.lowerCase().includes('bitcoin')) {
//     return alert('Nope, that is a bad idea');
//   }

//   return store.dispatch(action);

// }

store.subscribe(() => {
	// console.log('The new state is: ', store.getState());
	const { goals, todos } = store.getState();

	//rendering refresh
	document.getElementById('todos').innerHTML = '';
	document.getElementById('goals').innerHTML = '';

	goals.forEach(addGoalToDOM);
	todos.forEach(addTodoToDOM);
});

function addTodo() {
	const input = document.getElementById('todo');
	const name = input.value;
	input.value = '';

	store.dispatch(addTodoAction({ name, complete: false, id: generateId() }));
	// return a object
}

function addGoal() {
	const input = document.getElementById('goal');
	const name = input.value;
	input.value = '';

	store.dispatch(addGoalAction({ name, id: generateId() }));
}
function createRemoveButton(onClick) {
	const removeBtn = document.createElement('button');
	removeBtn.innerHTML = 'X';
	removeBtn.addEventListener('click', onClick);

	return removeBtn;
}

function addTodoToDOM(todo) {
	const node = document.createElement('li');
	const text = document.createTextNode(todo.name);

	const removeBtn = createRemoveButton(() => {
		store.dispatch(removeTodoAction(todo.id));
	});

	node.appendChild(text);
	node.appendChild(removeBtn);
	node.style.textDecoration = todo.complete ? 'line-through' : 'none';
	node.addEventListener('click', () => {
		store.dispatch(toggleTodoAction(todo.id));
	});
	document.getElementById('todos').appendChild(node);
}
function addGoalToDOM(goal) {
	const node = document.createElement('li');
	const text = document.createTextNode(goal.name);

	const removeBtn = createRemoveButton(() => {
		store.dispatch(removeGoalAction(goal.id));
	});

	node.appendChild(text);
	node.appendChild(removeBtn);

	document.getElementById('goals').appendChild(node);
}

// function toggleTodo(todo) {
// 	todo.complete = !todo.complete;
// 	if (todo.complete) {
// 		let text = document.getElementById(todo.id).strike();
// 		document.getElementById(todo.id).innerHTML = text;
// 	}
// }
// document.getElementById('todoBtn').addEventListener('click', addTodo);

// document.getElementById('goalBtn').addEventListener('click', addGoal);

//
