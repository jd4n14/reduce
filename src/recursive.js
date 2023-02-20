const transform = (items, model) => {
  const generateKeyFn = () => {
    const keyList = [];
    const keyFn = (key) => {
      keyList.push(key);
      return key;
    };
    return { keyFn, getLastKey: () => keyList[0] };
  };

  const createNestedMap = (item, model) => {
    const output = {};
    for (const [property, value] of Object.entries(model)) {
      if (typeof value === "function") {
        const { keyFn, getLastKey: getCurrentKey } = generateKeyFn();
        const propertyMap = new Map();
        const model = value(item, keyFn);
        const nestedObj = createNestedMap(item, model, propertyMap);
        propertyMap.set(getCurrentKey(), nestedObj);
        output[property] = propertyMap;
      } else {
        output[property] = value;
      }
    }
    return output;
  };
  const globalItemsMap = new Map();
  const recursiveMerge = (map, model) => {
    let currentProperty = null;
    for (const [key, value] of map.entries()) {
      if (value instanceof Map) {
      } else {

      }
    }
  };

  const rr = items.reduce((reducer, item) => {
    const { getLastKey, keyFn } = generateKeyFn();
    const modelFn = model(item, keyFn);
    const objectWithMaps = createNestedMap(item, modelFn, new Map());
    const itemMap = new Map();
    itemMap.set(getLastKey(), objectWithMaps);
    return globalItemsMap;
  }, []);
  console.log(rr);
};

const orders = [
  {
    orderId: 1,
    orderName: "Order 1",
    productId: 1,
    productName: "Product 1",
  },
  {
    orderId: 1,
    orderName: "Order 1",
    productId: 2,
    productName: "Product 1",
  },
];

const model = (order, key) => ({
  id: key(order.orderId),
  name: order.orderName,
  products: (product, key) => ({
    id: key(product.productId),
    name: product.productName,
  }),
});

transform(orders, model);
