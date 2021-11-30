// Typically I'll store the below in something like "typings.d.ts"
// this is because, at least typically, these overrides tend to
// be minimal in nature. You could break them up and Typescript
// will pick them up if you wish.

// Augmentations for the global scope can only be directly nested
// in external modules or ambient module declarations.
export {};

declare global {
	type V8Runtime = object;

	namespace NodeJS {
		interface Global {
			_v8runtime?: V8Runtime;
		}
	}

	const _v8runtime: V8Runtime | undefined;
}
