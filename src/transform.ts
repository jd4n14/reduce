import type { Id, KeyFn, TransformOptions, ReturnType } from "./types";
import { Node } from "./node";
import { NodeList } from "./node-list";

export const transform = <
  T extends Record<string, any>,
  B extends TransformOptions,
  K
>(
  items: Array<T>,
  model: (item: T, key: KeyFn) => K,
  options: B = { raw: false } as B
): ReturnType<B, K> => {
  const nodeList = new NodeList<K>();
  const generateKeyFn = () => {
    const keyList: Array<Id> = [];
    const keyFn = (key: Id) => {
      keyList.push(key);
      return key;
    };
    return { keyFn, getKey: () => keyList[0] };
  };
  const iterateModel = (item: T, model: K, ref: any) => {
    const node = new Node<K>();
    for (const [property, value] of Object.entries(model)) {
      if (typeof value === "function") {
        const { keyFn, getKey } = generateKeyFn();
        const model = value(item, keyFn);

        const nodeList = ref[property] || new NodeList();
        const newNode = iterateModel(
          item,
          model,
          nodeList.find(getKey()) || new Node()
        );
        nodeList.append(getKey(), newNode);

        node[property] = nodeList;
      } else {
        node[property] = value;
      }
    }
    return node;
  };
  for (const item of items) {
    const { keyFn, getKey } = generateKeyFn();
    const modelFn = model(item, keyFn);
    const node = nodeList.find(getKey()) || new Node();
    const output = iterateModel(item, modelFn, node);
    node.fromObject(output as K);
    nodeList.append(getKey(), node);
  }
  if (options.raw) return nodeList as ReturnType<B, K>;
  else return nodeList._ref as ReturnType<B, K>;
};
