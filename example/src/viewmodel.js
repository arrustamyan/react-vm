import React, { useContext, useState } from 'react';
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
var ViewModelContext = React.createContext(null);
export function viewModel(Component, Controller) {
    var controller = new Controller();
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.componentDidMount = function () {
            controller.$mount(this.props);
        };
        class_1.prototype.componentWillUnmount = function () {
            controller.$unmount();
        };
        class_1.prototype.render = function () {
            return (React.createElement(ViewModelContext.Provider, { value: controller },
                React.createElement(Component, null)));
        };
        return class_1;
    }(React.Component));
}
export function useViewModel() {
    var vm = useContext(ViewModelContext);
    var _a = useState(null), update = _a[1];
    var observer = {
        set: function (target, prop, value) {
            target[prop] = value;
            update(Math.random());
            return true;
        },
        get: function (target, prop, receiver) {
            var value = target[prop];
            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, observer);
            }
            return target[prop];
        }
    };
    return new Proxy(vm, observer);
}
