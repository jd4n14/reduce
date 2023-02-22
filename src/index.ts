import { transform } from "./transform";
import { KeyFn } from "./types";

export { transform } from "./transform";
export { KeyFn } from "./types";

const orders = [
  {
    orderId: 1,
    orderName: "Order 1",
    productId: 3,
    productName: "Product 3",
    categoryId: 1,
    categoryName: "Category 1",
  },
  {
    orderId: 3,
    orderName: "Order 1",
    productId: 3,
    productName: "Product 2",
    categoryId: 2,
    categoryName: "Category 2",
  },
  {
    orderId: 2,
    orderName: "Order 2",
    productId: 2,
    productName: "Product 2",
    categoryId: 1,
    categoryName: "Category 1",
  },
];

const result = transform(orders, (order, key) => ({
  id: key(order.orderId),
  products: (product, key) => ({
    id: key(product.productId),
    name: product.productName,
  }),
}));

console.log(result);
