export function createProvider(store) {
  const subscriptions = new Map();

  function connect(component) {
    const {
      mapStateToProps
    } = component;

    subscriptions[component] = store.subscribe(() => {
      assignProps(
        component,
        mapStateToProps(store.getState())
      );
    });
    assignProps(
      component,
      mapStateToProps(store.getState())
    );
  }

  function disconnect(component) {
    const unsubscribe = subscriptions[component];
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  }

  return {
    connect,
    disconnect
  };
}

function assignProps(component, props = {}) {
  Object.keys(props).forEach(propName => {
    if (component[propName] !== props[propName]) {
      component[propName] = props[propName];
    }
  });
}

const noop = () => {};
