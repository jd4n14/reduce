// create test for node class
/// <reference types="jest" />
import { Node } from '../src';
import { NodeList } from "../src";

describe("Node", () => {
    test("should create a node", () => {
        const node = new Node();
        expect(node).toBeDefined();
        expect(node).toBeInstanceOf(Node);
    });
    test("should create a node with a ref", () => {
        const node = new Node();
        expect(node._ref).toBeDefined();
    });

    test('should have properties', () => {
        const properties =  { name: 'test', age: 10 };
        const node = new Node();
        node.fromObject(properties);

        expect(node).toEqual(
            expect.objectContaining({
                _ref: expect.any(Object),
                name: expect.any(String),
                age: expect.any(Number),
            }),
        )
    });
    test('should properties exists in ref', () => {
        const properties = { name: 'test', age: 10 };
        const node = new Node();
        node.fromObject(properties);

        expect(node._ref).toMatchSnapshot({
            name: expect.any(String),
            age: expect.any(Number),
        });
    });

    test('should generate ref', () => {
        const properties = { name: 'test', age: 10 };
        const node = new Node();
        Object.assign(node, properties);
        node.generateRef();
        expect(node._ref).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                age: expect.any(Number)
            }),
        )
    });
    test('should generate ref with node list', () => {
        const product = { name: 'test', id: 10, categories: new NodeList() };
        const mainNode = new Node();
        Object.assign(mainNode, product);
        mainNode.generateRef();

        const category = new Node();
        category.fromObject({ name: 'test', id: 1 });
        product.categories.append(category.id, category);

        expect(mainNode._ref).toMatchSnapshot({
            name: expect.any(String),
            id: expect.any(Number),
            categories: expect.any(Object)
        });
        expect(mainNode._ref.categories).toHaveLength(1);
    });
});