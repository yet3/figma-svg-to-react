/* @refresh reload */
import { render } from "solid-js/web";
import "@styles/index.scss";
import { App } from "./App";

const root = document.getElementById("root");
const isRootDefined = root instanceof HTMLElement;

if (import.meta.env.DEV && !isRootDefined) {
	throw new Error("Root element not found");
}

if (isRootDefined) {
	render(() => <App />, root);
}
