import uuid from "uuid";

/*
Example:
{
    "id": "1",
    "identifier": "1",
    "products": [
        {
            "id": "1",
            "name": "product 1",
            "price": 100
        
    ]
}
{
    "name": "1",
    "parent": null,
    "children": [
        {
            "name": "identifier",
            "parent": null,
            "children": [],
            "ref": "1"
        },
        {
            "name": "products",
            "parent": null,
            "ref": [],
            "children": [
                {
                    "name": "name",
                    "ref": "product 1",
                    "parent": null,
                    "children": []
                },
                {
                    "name": "price",
                    "ref": 100,
                    "parent": null,
                    "children": []
                }
            ]
        }
    ],
    "ref": [],
}
*/

type ObjectType<T extends Record<string, any>> = T;

class Leaf {
  name: string | number;
  parent: Leaf | Node | null;
  value: Array<Node | Leaf>;
}

class Node {
  id: string | number | null;
  parent: Node | Leaf | null;
  children: Array<Leaf | Node>;
  ref: any;

  createFromLeaf(leaf: Leaf) {
    this.id = leaf.name;
    this.parent = leaf.parent;
    this.children = [leaf];
    this.ref = leaf.value;
  }
}

class Tree<T> {
  children: Map<string | number, Node | Leaf>;
  // private function that generate unique id ussing uuid v4 and remove the dashes
  private generateId() {
    return uuid.v4().replace(/-/g, "");
  }
  constructor() {
    this.children = new Map();
  }
  addNode(node: Node | Leaf) {
    if (node instanceof Leaf) {
      const newNode = new Node();
      newNode.createFromLeaf(node);
      const id = this.generateId();
      this.children.set(id, newNode);
      return newNode;
    }
    this.children.set(node.id, node);
  }
  findRootNodeById(id: string | number) {
    return this.children.get(id);
  }
  // recursive function that parse the object and return a tree
  parse<T>(
    id: string | number,
    item: Array<ObjectType<T>> | ObjectType<T> | string | number | undefined,
    ref: any
  ): Node | Leaf {
    if (Array.isArray(item)) {
      item.forEach((item) => {
        const key = item?.getKey() || this.generateId();
        const node = new Node();
        node.id = key;
        const children = Object.keys(item).map((key) => {
          const value = item[key];
          return this.parse(key, value, item[key]);
        });
        node.children = children;
        return node;
      });
    } else if (item instanceof Object) {
      for (const [key, value] of Object.entries(item)) {
        return this.parse(key, value, key[value]);
      }
    } else {
      const leaf = new Leaf();
      leaf.name = id;
      leaf.value = ref;
      return this.addNode(leaf);
    }
  }
}
