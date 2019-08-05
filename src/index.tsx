import React, { useContext } from 'react';

interface IControllerConstructor {
  new(): IController;
}

export interface IController {
  $mount?: ({}) => void;
  $unmount?: () => void;
}

const ViewModelContext = React.createContext(null);

export function viewModel(Component: React.ComponentType, Controller: IControllerConstructor) {
  const controller = new Controller();

  return class extends React.PureComponent<any, any> {

    constructor(props) {
      super(props);
      this.state = {
        force: 0,
        vm: controller,
      }
    }

    initializeVM() {
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

      const vm = new Proxy(new Controller(), observer);

      vm.$mount(this.props);

      this.setState({
        vm,
      });
    }

    componentDidMount() {
      this.initializeVM();
    }

    componentDidUpdate(prevProps) {
      const propsAreEqual = Object.keys(this.props).every(key => {
        return this.props[key] === prevProps[key];
      });

      if (propsAreEqual && Object.keys(this.props).length === Object.keys(prevProps).length) {
        return;
      }

      this.initializeVM();
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

export function useViewModel<C extends IController>(): C {
  return useContext(ViewModelContext);
}
