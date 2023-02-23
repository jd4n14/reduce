import type {
  Id,
  KeyFn,
  TransformOptions,
  ReturnType,
  ModelType,
  KeyFnOptions,
} from "./types";
import { Node } from "./node";
import { NodeList } from "./node-list";

const isUndefined = (value: any) => {
    return value === undefined || value === null;
}

export const transform = <
  T extends Record<string, any>,
  B extends TransformOptions,
  K extends ModelType<T>
>(
  items: Array<T>,
  model: (item: T, key: KeyFn) => K,
  options: B = { raw: false } as B
): ReturnType<B, K> => {
  const nodeList = new NodeList<K>();
  const generateKeyFn = () => {
    const keyList: Array<Id> = [];
    const options: KeyFnOptions = {}
    const keyFn: KeyFn = (key: Id, _options) => {
      Object.assign(options, _options)
      keyList.push(key);
      return key;
    };
    return { keyFn, getKey: () => keyList[0], options };
  };
  const iterateModel = (item: T, model: ModelType<T>, ref: any) => {
    const node = new Node<K>();
    for (const [property, value] of Object.entries(model)) {
      if (typeof value === "function") {
        const { keyFn, getKey, options } = generateKeyFn();
        const model = value(item, keyFn);
        const nodeList = ref[property] || new NodeList();

        if(options?.skipUndefined && isUndefined(getKey())) {
          node[property] = nodeList;
          continue;
        }
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
    const { keyFn, getKey, options } = generateKeyFn();
    const modelFn = model(item, keyFn);
    if(options?.skipUndefined && isUndefined(getKey())) continue;
    const node = nodeList.find(getKey()) || new Node();
    const output = iterateModel(item, modelFn, node);
    node.fromObject(output as any);
    nodeList.append(getKey(), node);
  }
  if (options.raw) return nodeList as unknown as ReturnType<B, K>;
  else return nodeList._ref as unknown as ReturnType<B, K>;
};
