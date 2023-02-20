type Id = string | number;
class Node {
  _ref: any;
  constructor() {
    this._ref = {};
  }
  fromObject(object: any) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
    this.generateRef();
  }
  generateRef() {
    for (const [key, value] of Object.entries(this)) {
      if(key === '_ref') continue;
      if (value instanceof NodeList) {
        this._ref[key] = value._ref;
        continue;
      };
      this._ref[key] = value;
    }
    return this._ref;
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
    this._ref.push(node.generateRef());
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
    productId: 3,
    productName: "Product 3",
  },
  {
    orderId: 1,
    orderName: "Order 1",
    productId: 2,
    productName: "Product 2",
  },
  {
    orderId: 2,
    orderName: "Order 2",
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
console.log(result._ref[0]);
