import path from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";

console.log(path.resolve("../../dist/plugin"))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [viteSingleFile(), tsconfigPaths()],
	build: {
		minify: mode === "production",
		target: "es2017",
		emptyOutDir: false,
		outDir: path.resolve("../../dist/plugin"),
		rollupOptions: {
			input: path.resolve("./src/index.ts"),
			output: {
				entryFileNames: "index.js",
			},
		},
	},
}));
