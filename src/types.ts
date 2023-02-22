import type { Node } from "./node";
import { NodeList } from "./node-list";
type Id = string | number;
type KeyFn = (key: Id) => Id;

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
  ? NodeListTypeRaw<K>
  : NodeListType<K>;

export type { Id, KeyFn, NodeListType, TransformOptions, NodeListTypeRaw, ReturnType };
