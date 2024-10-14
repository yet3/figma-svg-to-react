import type { JSX } from "solid-js";

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

export type OnInput = JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;
// export type InputEvent = Event & {
// 	currentTarget: HTMLInputElement;
// 	target: HTMLInputElement;
// };
