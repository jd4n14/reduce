type KeyFn = (key: string | number) => string | number;

function transform<
  T extends Record<string, unknown>,
  K extends Record<string, unknown>
>(items: T[], callback: (item: T, key: KeyFn) => K): K[] {
  const keyList: Array<string | number> = [];
  const keyFn: KeyFn = (key: string | number) => {
    keyList.push(key);
    return key;
  };
  const mapKeys = new Map<string, any>();

  const recursiveObject = (
    object: Record<string, unknown>,
    mapKeys: Map<string, any>,
    depth: number
  ): Record<string, unknown> | any => {
    const currentItem = {};
    for (const [key, value] of Object.entries(object)) {
      if (typeof value === "function") {
        const currentDepth = depth + 1;
        const currentChild = new Map<string, any>();
        const currentKey = keyList[depth++] as string;
        const child = recursiveObject(value(), mapKeys, currentDepth);
        currentChild.set(currentKey, child);
        currentItem[key] = currentChild;
        mapKeys.set(currentKey, child);
      } else {
        currentItem[key] = value;
        return value;
      }
    }
    console.log({ mapKeys });
    return currentItem;
  };

  const mapped = items.reduce<Array<Record<string, unknown>>>(
    (reducer, item) => {
      const currentItem = callback(item, keyFn);
      let depth = 0;
      const reducedObj = recursiveObject(currentItem, mapKeys, depth);
      console.log({ mapKeys})
      return reducer;
    },
    []
  );
  return mapped as K[];
}

const orders = [
  {
    orderId: 1,
    productId: 1,
    price: 100,
    quantity: 1,
    amount: 100,
    currency: "USD",
  },
  {
    orderId: 1,
    productId: 2,
    price: 200,
    quantity: 1,
    amount: 200,
    currency: "USD",
  },
  {
    orderId: 2,
    productId: 1,
    price: 300,
    quantity: 1,
    amount: 300,
    currency: "USD",
  },
  {
    orderId: 2,
    productId: 2,
    price: 400,
    quantity: 1,
    amount: 400,
    currency: "USD",
  },
  {
    orderId: 3,
    productId: 1,
    price: 500,
    quantity: 1,
    amount: 500,
    currency: "USD",
  },
];

const a = transform(orders, (order, key) => ({
  id: key(order.orderId),
  amount: order.amount,
  currency: order.currency,
  products: () => ({
    id: key(order.productId),
    quantity: order.quantity,
    price: order.price,
  }),
}));

console.log({ a: a.length });


const maps = new Map();
const depth1 = new Map();

maps.set('depth1', depth1);

const axs = Object.fromEntries(maps)
axs
