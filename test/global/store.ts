import { Action, createStore } from 'redux';

import { StoreService } from '../../src/store';

describe('@stencil/redux', () => {

  describe('global/store', () => {
    let storeService: StoreService;
    it('should return same redux store', () => {
      function counter(state = { app: {} }, action: Action<any>) {
        switch (action.type) {
          default:
            return state;
        }
      }
      const store = createStore(counter);
      storeService = StoreService.getInstance(store);
      expect(storeService.getStore()).toBe(store);
      expect(storeService.getState()).toEqual({ app: {} });
    });

  });

});
