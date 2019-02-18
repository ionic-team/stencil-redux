import { createStore } from 'redux';
import { Store } from '../../src/global/interfaces';

declare global {
  namespace NodeJS {
    interface Global {
      Context: {
        store: Store;
      }
    }
  }
}

(global as any).Context = {};
import '../../src/global/store';

describe('@stencil/redux', () => {

  describe('global/store', () => {

    it('should return same redux store', () => {
      const store = createStore(() => {});
      global.Context.store.setStore(store);
      expect(global.Context.store.getStore()).toBe(store);
    });

  });

});
