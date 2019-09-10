function createStore(reducer) {
  // The store should have four parts
  // 1. The state
  // 2. Get the state.
  // 3. Listen to changes on the state.
  // 4. Update the state

  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    // it is for unsubscribe the functions
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listern => listener());
  };

  return {
    getState,
    subscribe,
    dispatch
  };
}
const store = createStore();

store.subscribe(() => {
  console.log("The new state is:", store.getState());
});

// unsubscibe the listener repush all the listeners
// whenever subscribe, there is a repush of all the listeners.
const unsubscribe = store.subscribe(() => {
  console.log("The store changed.");
});

unsubscribe();

// App Code
// reducer : state, action
function todos(state = [], action) {
  if (action.type === "ADD_TODO") {
    return state.concat([action.todo]);
  }

  return state;
}
const store = createStore(todos);
store.subscribe(() => {
  console.log("The new state is: ", store.getState());
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    name: "Learn Redux",
    complete: false
  }
});
