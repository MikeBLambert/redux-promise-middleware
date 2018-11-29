export const middleware = store => next => action => {

  store.dispatch({ type: 'LOAD_START' });

  if(!isPromise) return next(action);

  return Promise.resolve(action)
    .then(store.dispatch({ type: 'LOAD_END' }));
}

const isPromise = payload => {
  if(typeof payload.then === 'function') return true;
  return false;
}