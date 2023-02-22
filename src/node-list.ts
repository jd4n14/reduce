import { Id } from './types';
import { Node } from './node';

export class NodeList<T> {
  list: Map<Id, Node<T>>;
  _ref: Array<T>;

  constructor() {
    this.list = new Map();
    this._ref = [];
  }

  append(id: Id, node: Node<T>): Node<T> {
    if (this.exists(id)) return;
    this.list.set(id, node);
    this._ref.push(node.generateRef());
    return node;
  }

  exists(id: Id): boolean {
    return this.list.has(id);
  }

  find(id: Id): Node<T> | undefined {
    return this.list.get(id);
  }
}
