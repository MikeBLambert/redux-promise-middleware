const LOAD_START = 'LOAD_START';
const LOAD_END = 'LOAD_END';
const ERROR = 'ERROR';

export const middleware = store => next => action => {
  const {type, payload } = action;

  if(!payload || !isPromise(payload)) return next(action);
  store.dispatch({ type: LOAD_START });

  action.payload
    .then(result => {
      store.dispatch({ type: LOAD_END, payload: result });
      next({ type, payload: result });
    })
    .catch(error => {
      store.dispatch({ type: LOAD_END })
      store.dispatch({ type: ERROR, payload: error })
    });
}

const isPromise = payload => {
  if(typeof payload.then === 'function') return true;
  return false;
}
