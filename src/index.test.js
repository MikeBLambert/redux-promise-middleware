import { middleware } from './index';
import { createStore, applyMiddleware } from 'redux';

describe('middleware', () => {
  const FAKE_ACTION = 'FAKE_ACTION';
  const LOAD_START = 'LOAD_START';
  const LOAD_END = 'LOAD_END';
  const ERROR = 'ERROR';

  describe('payload isnt a promise', () => {
    const reducer = jest.fn();
    const store = createStore(reducer, {}, applyMiddleware(middleware));

    it('doesnt start loading if payload isnt a promise', () => {
      const action = {
        type: FAKE_ACTION,
        payload: 'WAHOO!'
      }
      expect(reducer.mock.calls).toHaveLength(1);
    })
  })

  describe('payload is a promise', () => {
    const promise = Promise.resolve('made it!');

    it('starts loading when promise is sent', () => {
      const action = { type: FAKE_ACTION, payload: promise };
      const reducer = jest.fn();
      const store = createStore(reducer, {}, applyMiddleware(middleware));
      store.dispatch(action);
      expect(reducer.mock.calls[1][1].type).toEqual(LOAD_START);
    });

    it('ends loading when promise is resolved', () => {
      const action = { type: FAKE_ACTION, payload: promise };
      const reducer = jest.fn();
      const store = createStore(reducer, {}, applyMiddleware(middleware));
      store.dispatch(action)
      return promise
        .then(() => {
          expect(reducer.mock.calls[2][1].type).toEqual(LOAD_END);
        });
    });

    it('delivers action to reducer after promise is resolved', () => {
      const action = { type: FAKE_ACTION, payload: promise };
      const reducer = jest.fn();
      const store = createStore(reducer, {}, applyMiddleware(middleware));
      store.dispatch(action)
      return promise
        .then(() => {
          expect(reducer.mock.calls[3][1]).toEqual({ type: FAKE_ACTION, payload: 'made it!' });
        });
    });

    it('successfully errors', () => {
      const error = Promise.reject('This is an Error, Stupidhead!');
      const action = { type: ERROR, payload: error };
      const reducer = jest.fn();
      const store = createStore(reducer, {}, applyMiddleware(middleware));
      store.dispatch(action)
      return error
      .then()
      .catch(() => {
        expect(reducer.mock.calls[1][1].type).toEqual(LOAD_START);
        expect(reducer.mock.calls[2][1].type).toEqual(LOAD_END);
        expect(reducer.mock.calls[3][1]).toEqual({ type: ERROR, payload: 'This is an Error, Stupidhead!' });
      })
    })
  })
})
