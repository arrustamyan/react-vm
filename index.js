var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { useContext } from 'react';
var ViewModelContext = React.createContext(null);
function getControllerInstance(Controller, factory) {
    var controller;
    if (typeof Controller === 'function') {
        controller = new Controller();
    }
    else if (typeof factory === 'function') {
        controller = factory();
    }
    else {
        throw new Error('No controller/factory provided!');
    }
    return controller;
}
export function viewModel(Component, Controller, factory) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                force: 0,
                vm: getControllerInstance(Controller, factory),
            };
            return _this;
        }
        class_1.prototype.initializeVM = function () {
            var setState = this.setState.bind(this);
            var observer = {
                set: function (target, prop, value) {
                    target[prop] = value;
                    setState({
                        force: Math.random()
                    });
                    return true;
                },
                get: function (target, prop) {
                    var value = target[prop];
                    var ignoredProps = Object.getPrototypeOf(target).constructor.ignoredProps;
                    var isPropertyIgnored = false;
                    if (Array.isArray(ignoredProps) && ignoredProps.indexOf(prop) > -1) {
                        isPropertyIgnored = true;
                    }
                    if (typeof value === 'object' && value !== null && !isPropertyIgnored) {
                        return new Proxy(value, observer);
                    }
                    return target[prop];
                }
            };
            var vm = new Proxy(getControllerInstance(Controller, factory), observer);
            if (typeof vm.$mount === 'function') {
                vm.$mount(this.props);
            }
            this.setState({
                vm: vm,
            });
        };
        class_1.prototype.componentDidMount = function () {
            this.initializeVM();
        };
        class_1.prototype.componentDidUpdate = function (prevProps) {
            var _this = this;
            var propsAreEqual = Object.keys(this.props).every(function (key) {
                return _this.props[key] === prevProps[key];
            });
            if (propsAreEqual && Object.keys(this.props).length === Object.keys(prevProps).length) {
                return;
            }
            this.initializeVM();
        };
        class_1.prototype.componentWillUnmount = function () {
            var vm = this.state.vm;
            if (typeof vm.$unmount === 'function') {
                vm.$unmount();
            }
        };
        class_1.prototype.render = function () {
            return (React.createElement(ViewModelContext.Provider, { value: this.state.vm },
                React.createElement(Component, null)));
        };
        return class_1;
    }(React.PureComponent));
}
export function useViewModel() {
    return useContext(ViewModelContext);
}
