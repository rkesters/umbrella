# ${pkg.name}

[![npm version](https://img.shields.io/npm/v/${pkg.name}.svg)](https://www.npmjs.com/package/${pkg.name})
![npm downloads](https://img.shields.io/npm/dm/${pkg.name}.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

<!-- TOC -->

## About

${pkg.description}

Supports free block compaction and configurable splitting. Unlike the
original, this implementation also supports `realloc()` and does not
constrain the overall number of blocks in use and the only imposed limit
is that of the underlying array buffer.

Each `MemPool` instance operates on a single large `ArrayBuffer` used as
backing memory chunk, e.g. the same buffer used by a WASM module.

Even for non-WASM use cases, using this package can drastically speed up
allocation of typed arrays and reduce GC pressure. See
[benchmarks](#benchmarks) below.

## Memory layout

Since v4.1.0, all internal allocator state is stored in the
`ArrayBuffer` itself (thanks to the [initial idea & work done by
@Bnaya](https://github.com/thi-ng/umbrella/pull/153)). This change
allows the `ArrayBuffer` (or `SharedArrayBuffer`) being passed to
workers and/or the entire memory state being easily serialized/restored
to/from local storage.

The new memory layout is as follows:

![Memory layout diagram](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/malloc-layout.png)

## Free block compaction / coalescing

The allocator supports coalescing of free memory blocks to minimize
fragmentation of the managed address space. This feature is enabled by
default, but can be disabled via config options.

The following diagrams show the different stages of this behavior:

**Initial layout**

In this example we start with three allocated neighboring blocks:

![Block compaction (initial layout)](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/compact-01.png)

**Non-continuous free blocks**

After freeing the first & last blocks, the free blocks are linked via
their `next` pointers, but still occupy non-continuous memory regions.

![Block compaction (non-continuous)](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/compact-02.png)

**Single compacted free block**

After also freeing block #2, all three blocks now span a single
continuous address range and are merged into a single larger free block.
Furthermore, if that resulting new block turns out to be the top-most
block (in terms of previously allocated address space), the allocator
does not create a free block at all, but merely resets its heap `top`
pointer to the beginning of that block and considers it blank space that
way (essentially a merge with the remaining free/unallocated space of
the array buffer).

![Block compaction (result)](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/compact-03.png)

## Block splitting

In order to avoid unnecessary growing of the heap `top`, the allocator
can split existing free blocks if the user requests allocating a smaller
size than that of a suitable free block available. If the free block has
sufficient excess space (configurable via the `minSplit` option), the
free block will be split, the lower part marked as allocated and
inserted into the used block list and the excess space inserted as new
free block back into the free list.

This behavior too is enabled by default, but can be turned off via the
`split` config option.

Initial example layout:

![Block splitting (initial layout)](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/split-01.png)

Layout after allocating only a smaller size than the free block's
capacity:

![Block splitting (result)](https://raw.githubusercontent.com/thi-ng/umbrella/master/assets/malloc/split-02.png)

${status}

${supportPackages}

${relatedPackages}

${blogPosts}

## Installation

```bash
yarn add ${pkg.name}
```

## Dependencies

${pkg.deps}

${examples}

## API

${docLink}

### MemPool

The `MemPool` constructor takes an object of optional configuration
options. See
[`MemPoolOpts`](https://github.com/thi-ng/umbrella/blob/master/packages/malloc/src/api.ts#L9)
for further reference:

```ts
import { Type } from "@thi.ng/api";
import { MemPool } from "@thi.ng/malloc";

// example with some default options shown
new MemPool({
    size:     0x1000,
    compact:  true,
    split:    true,
    minSplit: 16
});

// create memory w/ optional start allocation address
// (start address can't be zero, reserved for malloc/calloc failure)
const pool = new MemPool({ size: 0x1000, start: 8 });

// all memory blocks will be aligned to 8-byte boundaries
// size is given in bytes
// returns pointer / index in array buffer
ptr = pool.malloc(16);
// 8

// request memory and return as typed array view
// in this case we use number of elements, NOT bytes
// IMPORTANT: there's no guarantee that the returned array's
// values are zeroed. Use `calloc`/`callocAs` for that purpose
vec = pool.mallocAs(Type.F64, 4);
// Float64Array [ 0, 0, 0, 0 ]

// report block stats (sizes & addresses in bytes)
pool.stats();
// { free: { count: 0, size: 0 },
//   used: { count: 2, size: 48 },
//   top: 56,
//   available: 4040,
//   total: 4096 }

// reallocate/resize block for pointer/address
// (might move block contents to new mem region)
ptr = pool.realloc(ptr, 32);

// same but for arrays created with `mallocAs()`
vec = pool.reallocArray(vec, 5);

// release address or view back into pool / heap
pool.free(ptr);
// true
pool.free(vec);
// true

// pointers / views can only be freed once
pool.free(vec);
// false

// memory blocks are re-merged whenever possible
// likewise, available free blocks might be split
// if smaller size requested...
pool.stats();
// { free: { count: 1, size: 48 },
//   used: { count: 0, size: 0 },
//   top: 56,
//   available: 4040,
//   total: 4096 }
```

### `malloc(size: number)`

Attempts to allocate a new block of memory of given byte size and
returns start address if successful, or zero (`0`) if unsuccessful.
Memory blocks always start at multiples of the configured alignment
(default: 8).

### `mallocAs(type: Type, num: number)`

Similar to `malloc()`, but returns a typed array view of desired `type`
and instead of byte size, expects number of elements. Returns `null`, if
allocation failed.

Types are referred to via the `Type` enum in the base
[@thi.ng/api](https://github.com/thi-ng/umbrella/tree/master/packages/api/src/api.ts)
package, e.g. `Type.F64`:

`U8`, `U8C`, `I8`, `U16`, `I16`, `U32`, `I32`, `F32`, `F64`

### `calloc(size: number, fill = 0)`

Like `malloc()` but fill allocated block with given `fill` value before
returning. Unless the allocated block is immediately filled with user
data, this method is preferred over `malloc()` for safety.

### `callocAs(type: Type, num: number, fill = 0)`

Like `mallocAs()` but fills allocated block with `fill` value before
returning.

### `realloc(addr: number, size: number)`

Attempts to adjust the size of the block at the given allocated address
to new `size` or if not possible, attempt to allocate a new block and
copies contents of current block (if successful, automatically frees old
address). Returns new address if successful or else 0.

### `reallocArray(buf: TypedArray, num: number)`

Similar to `realloc()`, but takes a typed array created with
`mallocAs()` / `callocAs()` and returns new arrays of same type or
`null` if re-allocation wasn't possible.

### `free(addr: number | TypedArray)`

Releases given address or array view back into the pool. Returns `true`
if successful. Only previously allocated addresses or views created by
this instance can be freed and its the user's responsibility to not use
the freed address or view after this call.

### `freeAll()`

Frees all allocated blocks, essentially resets the pool. This is useful
when using a `MemPool` for temporary object allocation within a function
and then calling this method before returning. This is also much cheaper
than individually freeing the blocks.

### `release()`

This completely destroys all internal pool references & state and should
only be used when the pool is no longer needed. The pool is unusable
afterwards. If there're no other external references to the pool's
underlying `ArrayBuffer`, then it will also be garbage collected soon
after.

### `stats()`

Returns pool statistics (see above example).

## Benchmarks

Benchmark
([source](https://github.com/thi-ng/umbrella/blob/master/packages/malloc/bench/index.js))
comparing against raw typed array construction of different sizes:

```bash
node bench/index.js
```

```text
malloc_f64x4 x 3,317,667 ops/sec ±0.61% (93 runs sampled) mean: 0.00030ms**
malloc_f64x4_vanilla x 4,221,089 ops/sec ±0.32% (94 runs sampled) mean: 0.00024ms

malloc6_f64 x 358,405 ops/sec ±0.37% (90 runs sampled) mean: 0.00279ms
malloc6_f64_vanilla x 283,487 ops/sec ±0.81% (90 runs sampled) mean: 0.00353ms

malloc_f32x1024 x 13,700,920 ops/sec ±0.38% (96 runs sampled) mean: 0.00007ms
malloc_f32x1024_vanilla x 694,747 ops/sec ±2.11% (78 runs sampled) mean: 0.00144ms
```

In this micro benchmark, allocating 4KB blocks (1024 floats) is ~20x
faster than calling `new Float32Array(1024)`. On the other hand,
allocating tiny arrays is slightly slower than the vanilla version... YMMV!

## Authors

${authors}

## License

&copy; ${copyright} // ${license}