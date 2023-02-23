import { NodeList } from "../src";
import { Node } from '../src'
describe('NodeList', () => {
    test('should return a NodeList', () => {
        const nodeList = new NodeList();
        expect(nodeList).toBeInstanceOf(NodeList);
    });

    test('should return a NodeList with a ref', () => {
        const nodeList = new NodeList();
        expect(nodeList._ref).toBeDefined();
    });

    test('Should add a node', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        expect(nodeList._ref).toHaveLength(1)
    });

    test('Should create a map', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        expect(nodeList.list).toBeInstanceOf(Map);
    });

    test('Should create a map with a node', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        expect(nodeList.list.get(node.id)).toBeInstanceOf(Node);
    });

    test('Should find a node', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        expect(nodeList.find(node.id)).toBeInstanceOf(Node);
    });

    test('Should not find a node', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        expect(nodeList.find(2)).toBeUndefined();
    });

    test('Should not insert a duplicate node', () => {
        const nodeList = new NodeList();
        const properties = { id: 1, name: 'test' };
        const node = new Node();
        node.fromObject(properties);
        nodeList.append(node.id, node);
        nodeList.append(node.id, node);
        expect(nodeList._ref).toHaveLength(1);
    });
});