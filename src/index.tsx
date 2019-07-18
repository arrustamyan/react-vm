import React, { useContext, useState } from 'react';

const ViewModelContext = React.createContext(null);

export function viewModel(Component, Controller) {
  const controller = new Controller();

  return class extends React.Component {
    componentDidMount() {
      controller.$mount(this.props);
    }
    componentWillUnmount() {
      controller.$unmount();
    }
    render() {
      return (
        <ViewModelContext.Provider value={controller}>
          <Component />
        </ViewModelContext.Provider>
      );
    }
  }

}
export function useViewModel() {
  const vm = useContext(ViewModelContext);
  const [, update] = useState(null);

  const observer = {
    set(target, prop, value) {
      target[prop] = value;
      update(Math.random());

      return true;
    },
    get(target, prop, receiver) {
      const value = target[prop];
      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, observer);
      }
      return target[prop];
    }
  };

  return new Proxy(vm, observer);

}
