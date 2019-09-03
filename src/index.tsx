import React, { useContext } from 'react';

interface IControllerConstructor {
  new(): IController;
  ignoredProps: string[];
}

interface IControllerFactory {
  (): IController;
}

export interface IController {
  $mount?: (props: {[propName: string]: any}) => void | Promise<void>;
  $unmount?: () => void;
  [name: string]: any;
}

export interface IViewModel extends IController {}

const ViewModelContext = React.createContext(null);

function getControllerInstance(Controller: IControllerConstructor, factory: IControllerFactory): IController {
  let controller;

  if (typeof Controller === 'function') {
    controller = new Controller();
  } else if (typeof factory === 'function') {
    controller = factory();
  } else {
    throw new Error('No controller/factory provided!');
  }

  return controller;
}

export function viewModel(Component: React.ComponentType, Controller: IControllerConstructor, factory?: IControllerFactory) {

  return class extends React.PureComponent<any, any> {

    constructor(props) {
      super(props);
      this.state = {
        force: 0,
        vm: getControllerInstance(Controller, factory),
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
          const ignoredProps = Object.getPrototypeOf(target).constructor.ignoredProps;

          let isPropertyIgnored = false;

          if (Array.isArray(ignoredProps) && ignoredProps.indexOf(prop) > -1) {
              isPropertyIgnored = true;
          }

          if (typeof value === 'object' && value !== null && !isPropertyIgnored) {
              return new Proxy(value, observer);
          }
          return target[prop];
        }
      };

      const vm = new Proxy(getControllerInstance(Controller, factory), observer);

      if (typeof vm.$mount === 'function') {
        vm.$mount(this.props);
      }


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
      const vm = this.state.vm;
      if (typeof vm.$unmount === 'function') {
        vm.$unmount();
      }
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
