var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { Component } from 'react';
import { createInputProcessor, UserInputType } from './internals/inputProcessor';
export default class MaskedInput extends Component {
    constructor(props) {
        super(props);
        this.onTextChange = this.onTextChange.bind(this);
        this.state = { value: props.value || '' };
        this.userInputProcessorFunction = createInputProcessor(props.mask);
    }
    onTextChange(text) {
        this.updateMaskedValue(text);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.userInputProcessorFunction = createInputProcessor(nextProps.mask);
        this.updateMaskedValue(nextProps.value || '');
    }
    updateMaskedValue(inputValue) {
        const maskResult = this.userInputProcessorFunction(inputValue, UserInputType.INSERTION);
        const previousValue = this.state.value;
        const currentValue = maskResult.text;
        this.setState({ value: currentValue });
        if (this.props.onTextChange && currentValue !== previousValue) {
            this.props.onTextChange(maskResult.text, maskResult.complete);
        }
    }
    render() {
        let _a = this.props, { mask, value, onTextChange } = _a, attributes = __rest(_a, ["mask", "value", "onTextChange"]);
        return (React.createElement("input", Object.assign({}, attributes, { value: this.state.value, onChange: (event) => this.onTextChange(event.target.value) })));
    }
}
//# sourceMappingURL=index.js.map