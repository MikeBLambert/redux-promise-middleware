export const middleware = store => next => action => {
  if(!action.payload || !isPromise(action.payload)) return next(action);
  store.dispatch({ type: 'LOAD_START' });

  action.payload
    .then(result => {
      store.dispatch({ type: 'LOAD_END' });
      action.payload = result;
      next(action);
    })
    .catch(error => {
      store.dispatch({ type: 'LOAD_END' })
      action.payload = error;
      next(action)
    });
}

const isPromise = payload => {
  if(typeof payload.then === 'function') return true;
  return false;
}
