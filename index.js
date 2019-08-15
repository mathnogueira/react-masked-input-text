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
System.register("internals/types", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("internals/maskTokenizer", [], function (exports_2, context_2) {
    "use strict";
    var specialCharacters;
    var __moduleName = context_2 && context_2.id;
    function getNextTokenLength(mask, startIndex) {
        const char = mask.charAt(startIndex);
        if (char === '\\') {
            const lookAhead = mask.charAt(startIndex + 2);
            if (lookAhead === '?') {
                return 3;
            }
            return 2;
        }
        const nextChar = mask.charAt(startIndex + 1);
        if (nextChar === '?') {
            return 2;
        }
        return 1;
    }
    function tokenize(mask) {
        const tokens = [];
        let currentIndex = 0;
        while (currentIndex < mask.length) {
            const nextTokenLength = getNextTokenLength(mask, currentIndex);
            const nextToken = mask.substr(currentIndex, nextTokenLength);
            tokens.push(nextToken);
            currentIndex += nextTokenLength;
        }
        return tokens;
    }
    exports_2("tokenize", tokenize);
    function createMaskTokenFromString(tokenString) {
        let realTokenValue = tokenString;
        const maskToken = {
            token: '',
            literal: false,
            optional: false
        };
        if (isLiteral(tokenString)) {
            realTokenValue = realTokenValue.substr(1);
            maskToken.literal = true;
            if (tokenString.length > 2 && isOptional(tokenString)) {
                realTokenValue = realTokenValue.substr(0, realTokenValue.length - 1);
                maskToken.optional = true;
            }
        }
        else if (isOptional(tokenString)) {
            realTokenValue = realTokenValue.replace('?', '');
            maskToken.optional = true;
        }
        maskToken.token = realTokenValue;
        if (isImplicitLiteral(maskToken.token)) {
            maskToken.literal = true;
        }
        return maskToken;
    }
    function isOptional(token) {
        return token.endsWith('?');
    }
    function isLiteral(token) {
        return token.startsWith('\\');
    }
    function isImplicitLiteral(token) {
        return !specialCharacters.includes(token);
    }
    function getTokens(mask) {
        const tokens = tokenize(mask);
        return tokens.map(createMaskTokenFromString);
    }
    exports_2("getTokens", getTokens);
    return {
        setters: [],
        execute: function () {
            specialCharacters = ['0', 'x', 'X', 's', 'a'];
        }
    };
});
System.register("internals/tokens/token", [], function (exports_3, context_3) {
    "use strict";
    var Token;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Token = class Token {
            };
            exports_3("default", Token);
        }
    };
});
System.register("internals/tokens/literalToken", ["internals/tokens/token"], function (exports_4, context_4) {
    "use strict";
    var token_1, charsNeedEscaping, LiteralToken;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (token_1_1) {
                token_1 = token_1_1;
            }
        ],
        execute: function () {
            charsNeedEscaping = ['(', ')', '+', '*', '.', '[', ']', '?'];
            LiteralToken = class LiteralToken extends token_1.default {
                constructor(tokenValue) {
                    super();
                    this.tokenValue = tokenValue;
                }
                getRegex() {
                    const escapingChar = this.needsEscaping() ? '\\' : '';
                    return `${escapingChar}${this.tokenValue}`;
                }
                needsEscaping() {
                    return charsNeedEscaping.includes(this.tokenValue);
                }
            };
            exports_4("default", LiteralToken);
        }
    };
});
System.register("internals/tokens/simpleToken", ["internals/tokens/token"], function (exports_5, context_5) {
    "use strict";
    var token_2, SimpleToken;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (token_2_1) {
                token_2 = token_2_1;
            }
        ],
        execute: function () {
            SimpleToken = class SimpleToken extends token_2.default {
                constructor(tokenValue) {
                    super();
                    this.tokenValue = tokenValue;
                }
                getRegex() {
                    switch (this.tokenValue) {
                        case '0': return '[0-9]';
                        case 'x': return '[a-z]';
                        case 'X': return '[A-Z]';
                        case 's': return '[a-zA-Z]';
                        case 'a': return '[a-zA-Z0-9]';
                        default: return `\\${this.tokenValue}`;
                    }
                }
            };
            exports_5("default", SimpleToken);
        }
    };
});
System.register("internals/tokens/tokenDecorator", ["internals/tokens/token"], function (exports_6, context_6) {
    "use strict";
    var token_3, TokenDecorator;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (token_3_1) {
                token_3 = token_3_1;
            }
        ],
        execute: function () {
            TokenDecorator = class TokenDecorator extends token_3.default {
                constructor(token) {
                    super();
                    this.innerToken = token;
                }
            };
            exports_6("default", TokenDecorator);
        }
    };
});
System.register("internals/tokens/optionalToken", ["internals/tokens/tokenDecorator"], function (exports_7, context_7) {
    "use strict";
    var tokenDecorator_1, OptionalToken;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (tokenDecorator_1_1) {
                tokenDecorator_1 = tokenDecorator_1_1;
            }
        ],
        execute: function () {
            OptionalToken = class OptionalToken extends tokenDecorator_1.default {
                getRegex() {
                    return `(${this.innerToken.getRegex()})?`;
                }
            };
            exports_7("default", OptionalToken);
        }
    };
});
System.register("internals/maskRegexCreator", ["internals/tokens/literalToken", "internals/tokens/simpleToken", "internals/tokens/optionalToken"], function (exports_8, context_8) {
    "use strict";
    var literalToken_1, simpleToken_1, optionalToken_1;
    var __moduleName = context_8 && context_8.id;
    function createRegexFromToken(token) {
        let tokenObject;
        if (token.literal) {
            tokenObject = new literalToken_1.default(token.token);
        }
        else {
            tokenObject = new simpleToken_1.default(token.token);
        }
        if (token.optional) {
            tokenObject = new optionalToken_1.default(tokenObject);
        }
        return tokenObject.getRegex();
    }
    exports_8("createRegexFromToken", createRegexFromToken);
    function createMaskRegex(tokens) {
        const regexes = tokens.map(createRegexFromToken);
        return regexes.reduce((maskRegex, tokenRegex) => maskRegex + tokenRegex, '');
    }
    exports_8("createMaskRegex", createMaskRegex);
    return {
        setters: [
            function (literalToken_1_1) {
                literalToken_1 = literalToken_1_1;
            },
            function (simpleToken_1_1) {
                simpleToken_1 = simpleToken_1_1;
            },
            function (optionalToken_1_1) {
                optionalToken_1 = optionalToken_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("internals/maskedTextResultFactory", [], function (exports_9, context_9) {
    "use strict";
    var MaskedTextResultFactory;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            MaskedTextResultFactory = class MaskedTextResultFactory {
                constructor(tokensRegex) {
                    this.completenessRegex = tokensRegex.reduce((maskRegex, tokenRegex) => maskRegex + tokenRegex.regex, '');
                }
                create(text) {
                    const x = text.match(this.completenessRegex);
                    const isComplete = !!x;
                    return {
                        text,
                        complete: isComplete
                    };
                }
            };
            exports_9("default", MaskedTextResultFactory);
        }
    };
});
System.register("internals/inputProcessor", ["internals/maskTokenizer", "internals/maskRegexCreator", "internals/maskedTextResultFactory"], function (exports_10, context_10) {
    "use strict";
    var maskTokenizer_1, maskRegexCreator_1, maskedTextResultFactory_1, UserInputType;
    var __moduleName = context_10 && context_10.id;
    function createInputProcessor(mask) {
        const tokens = maskTokenizer_1.getTokens(mask);
        const regexes = createTokenRegexes(tokens);
        const maskTextResultFactory = new maskedTextResultFactory_1.default(regexes);
        const inputProcessorOptions = {
            regexes
        };
        return (value, inputType) => {
            let appliedMask;
            let numberTokensConsumed = 0;
            let lastIterationValue = '';
            for (let index = 0; index < value.length; index++) {
                const currentChar = value.charAt(index);
                const currentValue = lastIterationValue + currentChar;
                appliedMask = processUserInput(currentValue, inputType, inputProcessorOptions, numberTokensConsumed);
                numberTokensConsumed += appliedMask.numberConsumedTokens;
                lastIterationValue = appliedMask.text;
                if (!appliedMask.valid) {
                    return maskTextResultFactory.create(appliedMask.text);
                }
            }
            const text = appliedMask ? appliedMask.text : '';
            return maskTextResultFactory.create(text);
        };
    }
    exports_10("createInputProcessor", createInputProcessor);
    function createTokenRegexes(tokens) {
        const tokenRegexes = [];
        for (const token of tokens) {
            const regex = maskRegexCreator_1.createRegexFromToken(token);
            const tokenRegex = {
                text: token.token,
                literal: token.literal,
                optional: token.optional,
                regex
            };
            tokenRegexes.push(tokenRegex);
        }
        return tokenRegexes;
    }
    function processUserInput(value, inputType, options, currentIndex = 0) {
        let numberTokensConsumed = 1;
        let previousValue = value.substr(0, value.length - 1);
        const currentCharPosition = value.length - 1;
        const currentRegexPosition = currentIndex || currentCharPosition;
        const currentChar = value[currentCharPosition];
        let currentRegex = options.regexes[currentRegexPosition];
        if (value.length > options.regexes.length || !currentRegex) {
            return createMaskResult(previousValue, previousValue.length - 1, false);
        }
        const autoCompleteResults = autofillNextChars(currentChar, inputType, options.regexes, currentRegexPosition);
        const numberTokensAutoCompleted = autoCompleteResults.numberTokensConsumed;
        if (numberTokensAutoCompleted > 0) {
            previousValue += autoCompleteResults.text;
            currentRegex = options.regexes[currentRegexPosition + numberTokensAutoCompleted];
            numberTokensConsumed += numberTokensAutoCompleted;
        }
        if (autoCompleteResults.inputWasIgnored) {
            return createMaskResult(previousValue, 0);
        }
        if (currentCharMatchesRegex(currentChar, currentRegex)) {
            const newValue = previousValue + currentChar;
            return createMaskResult(newValue, numberTokensConsumed);
        }
        return createMaskResult(previousValue, numberTokensConsumed, false);
    }
    function createMaskResult(maskedValue, numberConsumedTokens, valid = true) {
        return { text: maskedValue, numberConsumedTokens: numberConsumedTokens, valid: valid };
    }
    function autofillNextChars(currentChar, inputType, tokens, currentTokenIndex) {
        let autoFilledValue = '';
        let numberSuccessfulIterations = 0;
        let autoCompleted;
        let currentToken = tokens[currentTokenIndex];
        let currentIndex = currentTokenIndex;
        let inputWasIgnored = false;
        do {
            if (canNextCharBeAutoCompleted(currentChar, inputType, currentToken)) {
                autoFilledValue += currentToken.text;
                currentToken = tokens[currentIndex + 1];
                autoCompleted = true;
                numberSuccessfulIterations++;
                currentIndex++;
            }
            else if (canNextCharBeSkipped(currentChar, inputType, currentToken)) {
                currentToken = tokens[currentIndex + 1];
                autoCompleted = true;
                numberSuccessfulIterations++;
                currentIndex++;
            }
            else if (canCurrentCharBeRemovedFromInput(currentChar, inputType, currentToken)) {
                autoFilledValue = '';
                inputWasIgnored = true;
                autoCompleted = false;
            }
            else {
                autoCompleted = false;
            }
        } while (autoCompleted);
        return {
            numberTokensConsumed: numberSuccessfulIterations,
            text: autoFilledValue,
            inputWasIgnored: inputWasIgnored
        };
    }
    function canNextCharBeSkipped(currentChar, inputType, currentToken) {
        return (inputType === UserInputType.INSERTION &&
            currentToken.literal &&
            currentToken.optional &&
            !currentCharMatchesRegex(currentChar, currentToken));
    }
    function canNextCharBeAutoCompleted(currentChar, inputType, currentToken) {
        return (inputType === UserInputType.INSERTION &&
            currentToken.literal &&
            !currentToken.optional &&
            !currentCharMatchesRegex(currentChar, currentToken));
    }
    function canCurrentCharBeRemovedFromInput(currentChar, inputType, currentToken) {
        return (inputType === UserInputType.INSERTION &&
            !currentToken.literal &&
            !currentCharMatchesRegex(currentChar, currentToken));
    }
    function currentCharMatchesRegex(currentChar, token) {
        const match = currentChar.match(token.regex);
        return (match && match[0] === currentChar);
    }
    return {
        setters: [
            function (maskTokenizer_1_1) {
                maskTokenizer_1 = maskTokenizer_1_1;
            },
            function (maskRegexCreator_1_1) {
                maskRegexCreator_1 = maskRegexCreator_1_1;
            },
            function (maskedTextResultFactory_1_1) {
                maskedTextResultFactory_1 = maskedTextResultFactory_1_1;
            }
        ],
        execute: function () {
            (function (UserInputType) {
                UserInputType[UserInputType["INSERTION"] = 0] = "INSERTION";
                UserInputType[UserInputType["DELETION"] = 1] = "DELETION";
            })(UserInputType || (UserInputType = {}));
            exports_10("UserInputType", UserInputType);
        }
    };
});
System.register("index", ["react", "internals/inputProcessor"], function (exports_11, context_11) {
    "use strict";
    var React, react_1, inputProcessor_1, MaskedInput;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (React_1) {
                React = React_1;
                react_1 = React_1;
            },
            function (inputProcessor_1_1) {
                inputProcessor_1 = inputProcessor_1_1;
            }
        ],
        execute: function () {
            MaskedInput = class MaskedInput extends react_1.Component {
                constructor(props) {
                    super(props);
                    this.onTextChange = this.onTextChange.bind(this);
                    this.state = { value: props.value || '' };
                    this.userInputProcessorFunction = inputProcessor_1.createInputProcessor(props.mask);
                }
                onTextChange(text) {
                    this.updateMaskedValue(text);
                }
                componentWillReceiveProps(nextProps, nextContext) {
                    this.userInputProcessorFunction = inputProcessor_1.createInputProcessor(nextProps.mask);
                    this.updateMaskedValue(nextProps.value || '');
                }
                updateMaskedValue(inputValue) {
                    const maskResult = this.userInputProcessorFunction(inputValue, inputProcessor_1.UserInputType.INSERTION);
                    const previousValue = this.state.value;
                    const currentValue = maskResult.text;
                    this.setState({ value: currentValue });
                    if (this.props.onTextChange && currentValue !== previousValue) {
                        this.props.onTextChange(maskResult.text, maskResult.complete);
                    }
                }
                render() {
                    let _a = this.props, { mask, value, onTextChange } = _a, attributes = __rest(_a, ["mask", "value", "onTextChange"]);
                    return (React.createElement("input", Object.assign({ value: this.state.value, onChange: (event) => this.onTextChange(event.target.value) }, attributes)));
                }
            };
            exports_11("default", MaskedInput);
        }
    };
});
//# sourceMappingURL=index.js.map