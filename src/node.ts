type Id = string | number;
class Node {
  _ref: any;
  fromObject(object: any) {
    this._ref = object;
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
  generateRef() {
    this._ref = {};
    for (const [key, value] of Object.entries(this)) {
      if (key === "_ref") continue;
      if (typeof value === "function") continue;
      this._ref[key] = value;
    }
  }
  [key: Id]: NodeList | Id | any;
}

class NodeList {
  list: Map<Id, Node>;
  _ref: any;

  constructor() {
    this.list = new Map();
    this._ref = [];
  }

  append(id: Id, node: Node): Node {
    if (this.exists(id)) return;
    this.list.set(id, node);
    node.generateRef();
    this._ref.push(node._ref);
    return node;
  }

  exists(id: Id): boolean {
    return this.list.has(id);
  }

  find(id: Id): Node {
    return this.list.get(id);
  }
}

const transform = (items: Array<any>, model: any) => {
  const nodeList = new NodeList();
  const generateKeyFn = () => {
    const keyList: Array<Id> = [];
    const keyFn = (key: Id) => {
      keyList.push(key);
      return key;
    };
    return { keyFn, getKey: () => keyList[0] };
  };
  const iterateModel = (item: any, model: any, ref: any) => {
    const node = new Node();
    for (const [property, value] of Object.entries(model)) {
      if (typeof value === "function") {
        const { keyFn, getKey } = generateKeyFn();
        const model = value(item, keyFn);

        const newNode = iterateModel(item, model, ref[property]);
        const nodeList = ref[property] || new NodeList();
        nodeList.append(getKey(), newNode);

        node[property] = nodeList;
      } else {
        node[property] = value;
      }
    }
    return node;
  };
  // iterate over items
  for (const item of items) {
    const { keyFn, getKey } = generateKeyFn();
    const modelFn = model(item, keyFn);
    const node = nodeList.find(getKey()) || new Node();
    const output = iterateModel(item, modelFn, node);
    node.fromObject(output);
    nodeList.append(getKey(), node);
  }
  return nodeList;
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
    productName: "Product 2",
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

const result = transform(orders, model);
console.log(result);
