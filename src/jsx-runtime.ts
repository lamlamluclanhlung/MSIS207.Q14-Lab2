// ===== Types =====
export type Child = VNode | string | number;

export interface ComponentProps {
  children?: Child | Child[];
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

export interface VNode {
  type: string | ComponentFunction | 'fragment';
  props: Record<string, any>;
  children: Child[];
}

// ===== createElement / Fragment =====
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (Child | Child[])[]
): VNode {
  const flat = (children as any[])
    .flat(Infinity)
    .filter(c => c !== null && c !== undefined) as Child[];
  return { type, props: props ?? {}, children: flat };
}

export function createFragment(
  props: Record<string, any> | null,
  ...children: (Child | Child[])[]
): VNode {
  const flat = (children as any[])
    .flat(Infinity)
    .filter(c => c !== null && c !== undefined) as Child[];
  return { type: 'fragment', props: props ?? {}, children: flat };
}

// ===== Helpers =====
function isText(x: any): x is string | number {
  return typeof x === 'string' || typeof x === 'number';
}
function camelToKebab(s: string) {
  return s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

// ===== Event delegation (document-level) =====
const delegated = new Set<string>();
const handlerStore: Record<string, EventListener> = {};
let handlerId = 0;

function ensureDelegation(evt: string) {
  if (delegated.has(evt)) return;
  delegated.add(evt);
  document.addEventListener(
    evt,
    (e) => {
      let node = e.target as Element | null;
      const attr = 'data-on-' + evt;
      while (node && node !== document.documentElement) {
        const id = (node as HTMLElement).getAttribute?.(attr);
        if (id && handlerStore[id]) {
          handlerStore[id](e as any);
          return;
        }
        node = node.parentElement;
      }
    },
    false // dùng bubbling để chắc chắn value đã cập nhật
  );
}

function attachDelegated(el: Element, evt: string, handler: EventListener) {
  ensureDelegation(evt);
  const id = 'h' + ++handlerId;
  handlerStore[id] = handler;
  (el as HTMLElement).setAttribute('data-on-' + evt, id);
}

// ===== Renderer =====
export function renderToDOM(vnode: VNode | string | number): Node {
  // 1) Text nodes
  if (isText(vnode)) return document.createTextNode(String(vnode));

  // 2) Fragments
  if ((vnode as VNode).type === 'fragment') {
    const frag = document.createDocumentFragment();
    for (const ch of (vnode as VNode).children) frag.appendChild(renderToDOM(ch));
    return frag;
  }

  // 3) Function components
  if (typeof (vnode as VNode).type === 'function') {
    const comp = (vnode as VNode).type as ComponentFunction;
    const rendered = comp({
      ...(vnode as VNode).props,
      children: (vnode as VNode).children
    });
    return renderToDOM(rendered);
  }

  // 4) Regular elements
  const el = document.createElement((vnode as VNode).type as string);

  // Props
  const { children, ...rest } = (vnode as VNode).props || {};
  const props: Record<string, unknown> = rest;

  // Props & attributes
  for (const [key, value] of Object.entries(props)) {
    if (value == null) continue;

    if (key === 'key') continue; // không render key lên DOM

    if (key === 'className') {
      (el as HTMLElement).className = String(value);
      continue;
    }

    if (key === 'style') {
      if (typeof value === 'string') {
        (el as HTMLElement).setAttribute('style', value);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        const styleObj = value as Record<string, string | number>;
        for (const [k, v] of Object.entries(styleObj)) {
          (el as HTMLElement).style.setProperty(camelToKebab(k), String(v));
        }
      }
      continue;
    }

    // Ref support
    if (key === 'ref' && typeof value === 'function') {
      queueMicrotask(() => (value as (el: Element) => void)(el));
      continue;
    }

    // Events: onClick -> 'click' (delegation)
    if (key.startsWith('on') && typeof value === 'function') {
      const evt = key.slice(2).toLowerCase();
      attachDelegated(el, evt, value as EventListener);
      continue;
    }

    // Boolean attributes / properties
    if (typeof value === 'boolean') {
      (el as any)[key] = value;
      if (value) el.setAttribute(key, '');
      continue;
    }

    // Prefer property if exists, else attribute
    if (key in el) {
      try { (el as any)[key] = value; }
      catch { el.setAttribute(key, String(value)); }
    } else {
      el.setAttribute(key, String(value));
    }
  }

  // Children
  for (const ch of (vnode as VNode).children) el.appendChild(renderToDOM(ch));
  return el;
}

// ===== Minimal state (very simple re-render) =====
let _state: any[] = [];
let _cursor = 0;
let _rootVNode: VNode | null = null;
let _rootContainer: HTMLElement | null = null;

export function mount(vnode: VNode, container: HTMLElement): void {
  _rootVNode = vnode;
  _rootContainer = container;
  _cursor = 0;
  container.innerHTML = '';
  container.appendChild(renderToDOM(vnode));
}

export function useState<T>(
  initialValue: T
): [() => T, (v: T | ((prev: T) => T)) => void] {
  const idx = _cursor++;
  if (_state[idx] === undefined) _state[idx] = initialValue;

  const get = () => _state[idx] as T;
  const set = (next: T | ((prev: T) => T)) => {
    _state[idx] = typeof next === 'function' ? (next as any)(_state[idx]) : next;
    if (_rootVNode && _rootContainer) {
      _cursor = 0;
      const fresh = renderToDOM(_rootVNode);
      _rootContainer.innerHTML = '';
      _rootContainer.appendChild(fresh);
    }
  };
  return [get, set];
}
