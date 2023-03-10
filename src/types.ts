import { NodeList } from "./node-list";
type Id = string | number;
type KeyFnOptions = {
    skipUndefined?: boolean;
}
type KeyFn = (key: Id, options?: KeyFnOptions) => Id | undefined;

type NodeListType<T> = T extends (...params: any[]) => infer R
  ? NodeListType<R>
  : T extends infer O
  ? {
      [K in keyof O]: O[K] extends (...params: any[]) => infer R1
        ? NodeListType<R1>[]
        : O[K];
    }
  : T;

type NodeListTypeRaw<T> = T extends (...params: any[]) => infer R
  ? NodeListTypeRaw<R>
  : T extends infer O
  ? {
      [K in keyof O]: O[K] extends (...params: any[]) => infer R1
        ? NodeList<NodeListTypeRaw<R1>>
        : O[K];
    }
  : T;

type TransformOptions = {
  raw: boolean;
};

type ReturnType<C extends TransformOptions, K> = C["raw"] extends true
  ? NodeList<NodeListTypeRaw<K>>
  : NodeListType<K>;

type ModelProperty<T> =
  | Id
  | ((item: T, key: KeyFn) => ModelType<T>)
  | string
  | number;


type ModelType<T> = Record<string, ModelProperty<T>>;
export type {
  Id,
  KeyFn,
  KeyFnOptions,
  NodeListType,
  TransformOptions,
  NodeListTypeRaw,
  ReturnType,
  ModelType,
};
