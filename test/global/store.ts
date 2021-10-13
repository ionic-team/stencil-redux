import { createStore } from 'redux';
import { store } from '../../src/global/store';

describe('@stencil/redux', () => {
  describe('global/store', () => {
    it('should return same redux store', () => {
      const initialStore = createStore(() => {});
      store.setStore(initialStore);
      expect(store.getStore()).toBe(initialStore);
    });
  });
});
