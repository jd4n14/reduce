# Reducex

This is a TypeScript library that provides a utility function for grouping and reducing arrays with nested objects. It's
useful for applications that require complex data manipulation, such as data analysis, reporting, or visualization.

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
To use the utility function provided by this library, you need to import it into your TypeScript code:
```typescript
import { transform } from 'reducex';
```
Then write your model
```javascript
const model = (order, key) => ({
    id: key(order.orderId),
    name: order.orderName,
    products: (product, key) => ({
        id: key(product.productId),
        name: product.productName,
    })
})
```
The model is a function that takes two arguments: the current object and a key function. The key function is used to identify each object in the array. 
The model function returns an object that describes the structure of the resulting array. The model function can be nested to describe the structure of nested objects.

Then use the transform function to transform the array with nested objects:
```typescript
const orders = [{
    orderId: 1,
    orderName: '10001',
    productId: 1,
    productName: 'md size'
}]
```
```typescript
const result = transform(orders, model);
```
The result will be:
```typescript
[{
    id: 1,
    name: '10001',
    products: [
        {
            id: 1,
            name: 'md size'
        }
    ]
}]
```