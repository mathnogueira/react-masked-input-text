# Masked InputText for React
[![Build Status](https://travis-ci.org/ProdutorAgro/react-native-masked-input-text.svg?branch=master)](https://travis-ci.org/ProdutorAgro/react-native-masked-input-text)
[![Coverage Status](https://coveralls.io/repos/github/ProdutorAgro/react-native-masked-input-text/badge.svg?branch=master)](https://coveralls.io/github/ProdutorAgro/react-native-masked-input-text?branch=master)
[![npm version](https://img.shields.io/npm/v/react-masked-input-text.svg)](https://www.npmjs.com/package/react-native-masked-input-text)
## Install
NPM
```
npm install react-masked-input-text 
```

Yarn
```
yarn add react-masked-input-text
```

## Usage

```tsx
import MaskedInput from 'react-masked-input-text'

render() {
    return (
        <div>
            <MaskedInput mask={'xXas\\00?'} placeholder={'xXas00'} />
        </div>
    )
}
```

### Mask options
This library supports the following options as its mask definition:

* x: a lower case letter
* X: a upper case letter
* s: either a lower or upper case letter
* a: an alpha numeric char (either lower or upper case)
* 0: any digit
* ?: makes the previous symbol optional
* \\: Escapes the next symbol and makes it as a static part of the mask

Note: Any char not declared above are considered static.

### Examples

| Description           | Mask                    | Valid input           |
|:----------------------|:------------------------|:----------------------|
| US Phone number       | +1-000-000-0000         |+1-541-754-3010        |
| Date                  | 00/00/0000              | 25/12/2019            |
| Hour                  | 00:00                   | 23:15                 |
| Brazil Cellphones     | +55 (00) 9 0000-0000    | +55 (65) 9 8765-4321  |
| IP Address            | 00?0?.00?0?.00?0?.00?0? | 127.0.0.1             |
| CPF                   | 000.000.000-00          | 123.456.789-01        |
| Mask with letters     | XX-0000/1000            | AB-1234/1987          |