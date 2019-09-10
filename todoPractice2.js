function createStore() {
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

  return {
    getState,
    subscribe
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
