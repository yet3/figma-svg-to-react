import path from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	root: "./src",
	plugins: [solid(), viteSingleFile(), tsconfigPaths()],
	build: {
		target: "esnext",
		minify: mode === "production",
		cssMinify: mode === "production",
		emptyOutDir: false,
		outDir: path.resolve("../../dist/ui"),
		rollupOptions: {
			input: path.resolve("./src/index.html"),
		},
	},
}));
