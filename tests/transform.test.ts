import { KeyFn, transform, NodeList } from "../src";

describe('Transform function', function () {
    test('should return a instance of nodeList', function () {
        const orders = [{
            orderId: 1,
            orderName: '10001'
        }];
        const model = (order: typeof orders[number], key: (param: any) => any) => ({
            id: key(order.orderId),
            name: order.orderName
        });
        const result = transform(orders, model, { raw: true });
        expect(result).toBeInstanceOf(NodeList);
    });
    test('should transform the data', function () {
        const orders = [{
            orderId: 1,
            orderName: '10001'
        }];
        const model = (order: typeof orders[number], key: (param: any) => any) => ({
            id: key(order.orderId),
            name: order.orderName
        });
        const result = transform(orders, model);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.anything(),
                    name: expect.anything()
                }),
            ])
        )
        expect(result).toHaveLength(1)
    });
    test('should group the data with depth 2 with 1 items', function () {
        const orders = [{
            orderId: 1,
            orderName: '10001',
            productId: 1,
            productName: 'md size'
        }];
        const model = (order: typeof orders[number], key: (param: any) => any) => ({
            id: key(order.orderId),
            name: order.orderName,
            products: () => ({
                id: key(order.productId),
                name: order.productName
            })
        });
        const result = transform(orders, model);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.anything(),
                    name: expect.anything(),
                    products: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.anything(),
                            name: expect.anything()
                        }),
                    ])
                }),
            ])
        )
        expect(result).toHaveLength(1)
    });

    test('should group the data with 2 items',  () => {
        const orders = [{
            orderId: 1,
            orderName: '10001',
        },{
            orderId: 2,
            orderName: '10002',
        }];
        type OrderType = typeof orders[number];

        const model = (order: OrderType, key: KeyFn) => ({
            id: key(order.orderId),
            name: order.orderName
        });
        const result = transform(orders, model);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.anything(),
                    name: expect.anything(),
                }),
            ])
        )
        expect(result).toHaveLength(2)
    });

    test('should group array of items',  () => {
        const orders = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }];
        type OrderType = typeof orders[number];

        const model = (order: OrderType, key: KeyFn) => ({
            id: key(order.id),
        });
        const result = transform(orders, model);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.anything(),
                }),
            ])
        )
        expect(result).toHaveLength(3)
    });

    test('should group complex array of items',  () => {
        const orders = [
            {
                orderId: 1,
                orderName: '10001',
                productId: 1,
                productName: 'car mini',
                sizeId: 1,
                sizeName: 'md'
            },
            {
                orderId: 1,
                orderName: '10001',
                productId: 2,
                productName: 'car max',
                sizeId: 1,
                sizeName: 'lg'
            },
            {
                orderId: 1,
                orderName: '10001',
                productId: 2,
                productName: 'car max',
                sizeId: 2,
                sizeName: 'xl'
            },
            {
                orderId: 2,
                orderName: '10002',
                productId: 1,
                productName: 'car max',
                sizeId: 2,
                sizeName: 'xl'
            },
            {
                orderId: 2,
                orderName: '10002',
                productId: 2,
                productName: 'car max',
                sizeId: 2,
                sizeName: 'xl'
            }
        ]
        type OrderType = typeof orders[number];
        const model = (order: OrderType, key: KeyFn) => ({
            id: key(order.orderId),
            name: order.orderName,
            products: (product: OrderType, key: KeyFn) => ({
                id: key(product.productId),
                name: product.productName,
                sizes: (size: OrderType, key: KeyFn) => ({
                    id: key(size.sizeId),
                    name: size.sizeName
                }),
            }),
        })
        const groupped = [
            {
                id: 1,
                name: '10001',
                products: [
                    {
                        id: 1,
                        name: 'car mini',
                        sizes: [{
                            id: 1,
                            name: 'md'
                        }]
                    },
                    {
                        id: 2,
                        name: 'car max',
                        sizes: [{
                            id: 1,
                            name: 'lg'
                        }, {
                            id: 2,
                            name: 'xl'
                        }]
                    }
                ]
            },
            {
                id: 2,
                name: '10002',
                products: [{
                    id: 1,
                    name: 'car max',
                    sizes: [{
                        id: 2,
                        name: 'xl'
                    }]
                }, {
                    id: 2,
                    name: 'car max',
                    sizes: [{
                        id: 2,
                        name: 'xl'
                    }]
                }]
            }
        ];
        const result = transform(orders, model);
        expect(result).toEqual(
            groupped
        )
    });
});