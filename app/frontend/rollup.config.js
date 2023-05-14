import autoPreprocess from "svelte-preprocess";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import copy from "rollup-plugin-copy";
import svelte from "rollup-plugin-svelte";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

const dest = "./_dist";

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: dest + "/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    alias({
      resolve: [".svelte", ".ts"], //optional, by default this will just look for .js files or folders
      entries: [{ find: "@components", replacement: "src/components/" }],
    }),

    copy({
      targets: production ? [{ src: "public/**", dest }] : [],
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),

    typescript({
      tsconfig: "tsconfig.json",
      sourceMap: !production,
      inlineSources: !production,
      outputToFilesystem: true,
    }),
    commonjs(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
