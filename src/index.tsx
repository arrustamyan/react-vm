import React, { useContext, useState } from 'react';

const ViewModelContext = React.createContext(null);

export function viewModel(Component, Controller) {
  const controller = new Controller();

  return class extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        force: 0,
        vm: controller,
      }
    }
    componentDidMount() {
      const setState = this.setState.bind(this);
      const observer = {
        set(target, prop, value) {
          target[prop] = value;
          setState({
            force: Math.random()
          });

          return true;
        },
        get(target, prop) {
          const value = target[prop];
          if (typeof value === 'object' && value !== null) {
            return new Proxy(value, observer);
          }
          return target[prop];
        }
      };

      const vm = new Proxy(controller, observer);

      this.setState({
        vm,
      })

      vm.$mount(this.props);
    }
    componentWillUnmount() {
      this.state.vm.$unmount();
    }
    render() {
      return (
        <ViewModelContext.Provider value={this.state.vm}>
          <Component />
        </ViewModelContext.Provider>
      );
    }
  }
}

export function useViewModel() {
  return useContext(ViewModelContext);
}
