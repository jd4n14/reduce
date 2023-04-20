# Reducex

`reducex` is a lightweight JavaScript library that helps you transform and reduce flat arrays into complex structures while grouping and keeping unique values. With a simple and flexible API, you can easily define the structure of your desired output and reduce any flat array into nested objects or arrays.

## Installation
To use this library, you need to install it in your project. You can do this using npm:
```bash
npm install reducex
```
Or using yarn
```bash
yarn add reducex
```

## Usage
Import the transform function from the reducex package:

```javascript
import { transform } from 'reducex';
```

## Basic Example
Suppose you have the following flat array of orders with products:

```javascript
const orders = [
  {
    orderId: 1,
    orderName: '10001',
    productId: 1,
    productName: 'md size',
  },
  {
    orderId: 1,
    orderName: '10001',
    productId: 2,
    productName: 'sm size',
  },
];
```

You want to transform this array into a nested structure that groups products by their `orderId`. First, define the desired structure using the model function:
```js
const model = (order, key) => ({
  id: key(order.orderId),
  name: order.orderName,
  products: (product, key) => ({
    id: key(product.productId),
    name: product.productName,
  }),
});

```

Next, use the transform function with the orders array and the model function as arguments:

```js
const result = transform(orders, model);
```

The `result` will be:

```js
[
  {
    id: 1,
    name: '10001',
    products: [
      {
        id: 1,
        name: 'md size',
      },
      {
        id: 2,
        name: 'sm size',
      },
    ],
  },
];
```

## API

`transform(inputArray, modelFunction)`
* `inputArray` (Array): The input flat array you want to transform.
* `modelFunction` (Function): The function that defines the desired structure.

Returns a new array with the transformed structure.

### Model Function

The `model` function is used to define the desired structure for the output array. It should return an object with the desired properties and nested structures.

The function receives two parameters:
* The first parameter is an element from the input array.
* The second parameter is the key function used to generate unique keys for the output structure.

Nested structures should be defined as functions, which also receive the key function as the second parameter.

### License
MIT

