import { NodeList } from "./node-list";
export class Node<T extends Record<string, any>> {
  _ref: any;
  constructor() {
    this._ref = {};
  }
  fromObject(object: T) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
    this.generateRef();
  }
  generateRef() {
    for (const [key, value] of Object.entries(this)) {
      if (key === "_ref") continue;
      if (value instanceof NodeList) {
        this._ref[key] = value._ref;
        continue;
      }
      this._ref[key] = value;
    }
    return this._ref;
  }
  [key: string]: any;
}

export type NodeType = typeof Node;

