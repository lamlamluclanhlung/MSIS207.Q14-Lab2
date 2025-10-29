import type { VNode } from './jsx-runtime';

declare global {
  namespace JSX {
    type Element = VNode;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementChildrenAttribute { children: {}; }
  }
}
export {};
