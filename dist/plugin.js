const __pluginConfig =  {
  "name": "windy-plugin-wave-buoys-fr",
  "version": "0.1.0",
  "title": "Wave Buoys (FR)",
  "icon": "🌊",
  "description": "This plugin gives the french wave buoys data from CEREMA.",
  "author": "Edouard Gauvrit",
  "repository": "git+https://github.com/windycom/windy-plugins.git",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "desktopWidth": 600,
  "built": 1725625503959,
  "builtReadable": "2024-09-06T12:25:03.959Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    name: 'windy-plugin-wave-buoys-fr',
    version: '0.1.0',
    title: 'Wave Buoys (FR)',
    icon: '🌊',
    description: 'This plugin gives the french wave buoys data from CEREMA.',
    author: 'Edouard Gauvrit',
    repository: 'git+https://github.com/windycom/windy-plugins.git',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    desktopWidth: 600
};

var buoyInfo = [
	{
		ID: "05903",
		name: "Gravelines",
		lat: "51.04",
		lon: "2.07",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNTkwMw=="
	},
	{
		ID: "08002",
		name: "Baie de Somme",
		lat: "50.25",
		lon: "1.33",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wODAwMg=="
	},
	{
		ID: "07610",
		name: "Port d’Antifer",
		lat: "49.66",
		lon: "0.14",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNzYxMA=="
	},
	{
		ID: "07611",
		name: "Le Havre – Nord du mouillage",
		lat: "49.48",
		lon: "0.01",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNzYxMQ=="
	},
	{
		ID: "07609",
		name: "Le Havre – Haut du Sud-Ouest",
		lat: "49.47",
		lon: "0.08",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNzYwOQ=="
	},
	{
		ID: "05008",
		name: "Cherboug",
		lat: "49.69",
		lon: "-1.62",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNTAwOA=="
	},
	{
		ID: "02911",
		name: "Les Pierres Noires",
		lat: "48.29",
		lon: "-4.97",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMjkxMQ=="
	},
	{
		ID: "05602",
		name: "Belle-Ile",
		lat: "47.28",
		lon: "-3.28",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNTYwMg=="
	},
	{
		ID: "04403",
		name: "Plateau du Four",
		lat: "47.24",
		lon: "-2.78",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNDQwMw=="
	},
	{
		ID: "08505",
		name: "Noirmoutier",
		lat: "46.92",
		lon: "-2.47",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wODUwNQ=="
	},
	{
		ID: "08504",
		name: "Ile d’Yeu Nord",
		lat: "46.83",
		lon: "-2.29",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wODUwNA=="
	},
	{
		ID: "01704",
		name: "Oléron Large",
		lat: "45.92",
		lon: "-1.83",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMTcwNA=="
	},
	{
		ID: "01705",
		name: "Royan",
		lat: "45.61",
		lon: "-1.03",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMTcwNQ=="
	},
	{
		ID: "03302",
		name: "Cap Ferret",
		lat: "44.65",
		lon: "-1.45",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMzMwMg=="
	},
	{
		ID: "06402",
		name: "Anglet",
		lat: "43.53",
		lon: "-1.61",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNjQwMg=="
	},
	{
		ID: "06403",
		name: "Saint-Jean-de-Luz",
		lat: "43.41",
		lon: "-1.68",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNjQwMw=="
	},
	{
		ID: "06601",
		name: "Banyuls",
		lat: "42.49",
		lon: "3.17",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wNjYwMQ=="
	},
	{
		ID: "01101",
		name: "Leucate",
		lat: "42.92",
		lon: "3.12",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMTEwMQ=="
	},
	{
		ID: "03404",
		name: "Sète",
		lat: "43.37",
		lon: "3.78",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMzQwNA=="
	},
	{
		ID: "03001",
		name: "Espiguette",
		lat: "43.41",
		lon: "4.16",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMzAwMQ=="
	},
	{
		ID: "01305",
		name: "Le Planier",
		lat: "43.21",
		lon: "5.23",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMTMwNQ=="
	},
	{
		ID: "08302",
		name: "Porquerolles",
		lat: "42.97",
		lon: "6.2",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wODMwMg=="
	},
	{
		ID: "98000",
		name: "Monaco",
		lat: "43.71",
		lon: "7.43",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD05ODAwMA=="
	},
	{
		ID: "02B04",
		name: "La Revellata",
		lat: "42.57",
		lon: "8.65",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMkIwNA=="
	},
	{
		ID: "02B05",
		name: "Alistro",
		lat: "42.26",
		lon: "9.64",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMkIwNQ=="
	},
	{
		ID: "02A01",
		name: "Bonifacio",
		lat: "41.32",
		lon: "8.88",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD0wMkEwMQ=="
	},
	{
		ID: "97501",
		name: "Saint-Pierre et Miquelon",
		lat: "46.7",
		lon: "-56.18",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD05NzQwMw=="
	},
	{
		ID: "97801",
		name: "Saint-Martin",
		lat: "18.14",
		lon: "-62.99",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD05ODAwMA=="
	},
	{
		ID: "97403",
		name: "Rivière des Galets",
		lat: "-20.94",
		lon: "55.28",
		href: "https://candhis.cerema.fr/_public_/campagne.php?Y2FtcD05NzQwMw=="
	}
];

/* src/plugin.svelte generated by Svelte v4.2.19 */

function add_css(target) {
	append_styles(target, "svelte-1a51rpe", "p.svelte-1a51rpe{line-height:1.8;color:#e7d6a6}img.svelte-1a51rpe{display:block;margin:0 auto}table.svelte-1a51rpe{width:100%;border-collapse:collapse;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background-color:#fff;border-radius:8px;overflow:hidden}th.svelte-1a51rpe{background-color:#cfbe8d;color:white;border-bottom:2px solid #ddd;text-align:center;padding:12px 15px;font-weight:bold}td.svelte-1a51rpe{border-bottom:1px solid #b8b7b7;text-align:center;padding:10px 15px}tr.svelte-1a51rpe:nth-child(even){background-color:#666666}tr.svelte-1a51rpe:nth-child(odd){background-color:#808080}tr.svelte-1a51rpe:hover{background-color:#ad8b64}@media(max-width: 600px){th.svelte-1a51rpe,td.svelte-1a51rpe{font-size:14px}}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (188:4) {:else}
function create_else_block_1(ctx) {
	let h1;

	return {
		c() {
			h1 = element("h1");
			h1.textContent = "Please select a wave buoy.";
		},
		m(target, anchor) {
			insert(target, h1, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(h1);
			}
		}
	};
}

// (184:4) {#if selectedBuoyName.length > 0}
function create_if_block_1(ctx) {
	let h1;
	let t0;
	let t1;
	let t2;
	let t3;

	return {
		c() {
			h1 = element("h1");
			t0 = text(/*selectedBuoyName*/ ctx[1]);
			t1 = text(" (");
			t2 = text(/*selectedBuoyID*/ ctx[2]);
			t3 = text(")");
		},
		m(target, anchor) {
			insert(target, h1, anchor);
			append(h1, t0);
			append(h1, t1);
			append(h1, t2);
			append(h1, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*selectedBuoyName*/ 2) set_data(t0, /*selectedBuoyName*/ ctx[1]);
			if (dirty & /*selectedBuoyID*/ 4) set_data(t2, /*selectedBuoyID*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) {
				detach(h1);
			}
		}
	};
}

// (223:4) {:else}
function create_else_block(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = "No data available";
			attr(p, "class", "svelte-1a51rpe");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(p);
			}
		}
	};
}

// (196:4) {#if selectedBuoyData.length > 0}
function create_if_block(ctx) {
	let table;
	let thead;
	let t13;
	let tbody;
	let each_value = ensure_array_like(/*selectedBuoyData*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			table = element("table");
			thead = element("thead");
			thead.innerHTML = `<tr class="svelte-1a51rpe"><th class="svelte-1a51rpe">Date</th> <th class="svelte-1a51rpe">Hs</th> <th class="svelte-1a51rpe">Hmax</th> <th class="svelte-1a51rpe">Tp</th> <th class="svelte-1a51rpe">Dir.</th> <th class="svelte-1a51rpe">Spread</th> <th class="svelte-1a51rpe">Temp.</th></tr>`;
			t13 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(table, "class", "svelte-1a51rpe");
		},
		m(target, anchor) {
			insert(target, table, anchor);
			append(table, thead);
			append(table, t13);
			append(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(tbody, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*selectedBuoyData*/ 1) {
				each_value = ensure_array_like(/*selectedBuoyData*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(table);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (210:8) {#each selectedBuoyData as buoy}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*buoy*/ ctx[12][0] + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*buoy*/ ctx[12][1] + "";
	let t2;
	let t3;
	let td2;
	let t4_value = /*buoy*/ ctx[12][2] + "";
	let t4;
	let t5;
	let td3;
	let t6_value = /*buoy*/ ctx[12][3] + "";
	let t6;
	let t7;
	let td4;
	let t8_value = /*buoy*/ ctx[12][4] + "";
	let t8;
	let t9;
	let td5;
	let t10_value = /*buoy*/ ctx[12][5] + "";
	let t10;
	let t11;
	let td6;
	let t12_value = /*buoy*/ ctx[12][6] + "";
	let t12;
	let t13;

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td4 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td5 = element("td");
			t10 = text(t10_value);
			t11 = space();
			td6 = element("td");
			t12 = text(t12_value);
			t13 = space();
			attr(td0, "class", "svelte-1a51rpe");
			attr(td1, "class", "svelte-1a51rpe");
			attr(td2, "class", "svelte-1a51rpe");
			attr(td3, "class", "svelte-1a51rpe");
			attr(td4, "class", "svelte-1a51rpe");
			attr(td5, "class", "svelte-1a51rpe");
			attr(td6, "class", "svelte-1a51rpe");
			attr(tr, "class", "svelte-1a51rpe");
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(tr, t1);
			append(tr, td1);
			append(td1, t2);
			append(tr, t3);
			append(tr, td2);
			append(td2, t4);
			append(tr, t5);
			append(tr, td3);
			append(td3, t6);
			append(tr, t7);
			append(tr, td4);
			append(td4, t8);
			append(tr, t9);
			append(tr, td5);
			append(td5, t10);
			append(tr, t11);
			append(tr, td6);
			append(td6, t12);
			append(tr, t13);
		},
		p(ctx, dirty) {
			if (dirty & /*selectedBuoyData*/ 1 && t0_value !== (t0_value = /*buoy*/ ctx[12][0] + "")) set_data(t0, t0_value);
			if (dirty & /*selectedBuoyData*/ 1 && t2_value !== (t2_value = /*buoy*/ ctx[12][1] + "")) set_data(t2, t2_value);
			if (dirty & /*selectedBuoyData*/ 1 && t4_value !== (t4_value = /*buoy*/ ctx[12][2] + "")) set_data(t4, t4_value);
			if (dirty & /*selectedBuoyData*/ 1 && t6_value !== (t6_value = /*buoy*/ ctx[12][3] + "")) set_data(t6, t6_value);
			if (dirty & /*selectedBuoyData*/ 1 && t8_value !== (t8_value = /*buoy*/ ctx[12][4] + "")) set_data(t8, t8_value);
			if (dirty & /*selectedBuoyData*/ 1 && t10_value !== (t10_value = /*buoy*/ ctx[12][5] + "")) set_data(t10, t10_value);
			if (dirty & /*selectedBuoyData*/ 1 && t12_value !== (t12_value = /*buoy*/ ctx[12][6] + "")) set_data(t12, t12_value);
		},
		d(detaching) {
			if (detaching) {
				detach(tr);
			}
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let t3;
	let p0;
	let t4;
	let t5;
	let hr0;
	let t6;
	let t7;
	let hr1;
	let t8;
	let p1;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*selectedBuoyName*/ ctx[1].length > 0) return create_if_block_1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*selectedBuoyData*/ ctx[0].length > 0) return create_if_block;
		return create_else_block;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block1 = current_block_type_1(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[3]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[3]}`;
			t3 = space();
			p0 = element("p");
			p0.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1816/1816116.png" alt="Buoy" width="128" class="svelte-1a51rpe"/>`;
			t4 = space();
			if_block0.c();
			t5 = space();
			hr0 = element("hr");
			t6 = space();
			if_block1.c();
			t7 = space();
			hr1 = element("hr");
			t8 = space();
			p1 = element("p");
			p1.innerHTML = `<img src="https://urbanvitaliz.fr/static/img/partners/logo_cerema.png" alt="Cerema" width="256" class="svelte-1a51rpe"/>`;
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
			attr(p0, "class", "mt-5 mb-20 svelte-1a51rpe");
			attr(p1, "class", "mt-20 mb-5 svelte-1a51rpe");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(section, t3);
			append(section, p0);
			append(section, t4);
			if_block0.m(section, null);
			append(section, t5);
			append(section, hr0);
			append(section, t6);
			if_block1.m(section, null);
			append(section, t7);
			append(section, hr1);
			append(section, t8);
			append(section, p1);

			if (!mounted) {
				dispose = listen(div1, "click", /*click_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(section, t5);
				}
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type_1(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(section, t7);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if_block0.d();
			if_block1.d();
			mounted = false;
			dispose();
		}
	};
}

const url = "http://localhost:4000/scrape-data";

function getIcon(size) {
	return L.icon({
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2]
	});
}

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	let buoyMarkers = [];
	let buoyData = [];
	let selectedBuoyData = [];
	let selectedBuoyName = [];
	let selectedBuoyID = [];

	function updateIconsOnZoom() {
		const zoom = map.getZoom();
		const iconSize = 8 + zoom * 2;

		buoyMarkers.forEach(({ marker }) => {
			marker.setIcon(getIcon(iconSize));
		});
	}

	L.icon({
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
		iconSize: [22, 22],
		iconAnchor: [11, 11]
	});

	L.icon({
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816116.png',
		iconSize: [42, 42],
		iconAnchor: [21, 21]
	});

	async function fetchData() {
		try {
			const response = await fetch(url);

			if (response.ok) {
				buoyData = await response.json();
				updateMarkerPopups();
			} else {
				console.error('Failed to fetch data from server.');
			}
		} catch(error) {
			console.error('Error fetching data:', error);
		}
	}

	function updateMarkerPopups() {
		buoyMarkers.forEach(({ marker, ID }) => {
			const buoyDataEntry = buoyData[ID];
			let hs = 'N/A';
			let tp = 'N/A';
			let dir = 'N/A';

			if (buoyDataEntry && buoyDataEntry.length > 0 && buoyDataEntry[0].length > 1) {
				hs = buoyDataEntry[0][1];
				tp = buoyDataEntry[0][3];
				dir = buoyDataEntry[0][4];
			}

			marker.bindPopup(`
                <b>${marker.getPopup().getContent().split('<br>')[0]}</b><br>
                <b>Hs:</b> ${hs} | <b>Tp:</b> ${tp} | <b>Dir:</b> ${dir}
            `);
		});
	}

	onMount(() => {
		buoyInfo.forEach(buoy => {
			const { ID, name, lat, lon, href } = buoy;
			const buoyMarker = L.marker([lat, lon], { icon: getIcon(8 + map.getZoom() * 2) }).addTo(map);
			buoyMarker.bindPopup(`<b>${name}</b>`);
			buoyMarkers.push({ marker: buoyMarker, ID });

			buoyMarker.on('click', () => {
				$$invalidate(0, selectedBuoyData = buoyData[ID] || []);
				$$invalidate(1, selectedBuoyName = name);
				$$invalidate(2, selectedBuoyID = ID);
			});
		});

		fetchData();
		map.on('zoomend', updateIconsOnZoom);
	});

	onDestroy(() => {
		buoyMarkers.forEach(({ marker }) => {
			map.removeLayer(marker);
		});
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	return [selectedBuoyData, selectedBuoyName, selectedBuoyID, title, click_handler];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
