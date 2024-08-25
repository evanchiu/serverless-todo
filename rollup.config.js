import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.js",
  output: {
    file: "bundle.js",
    sourcemap: "inline",
    format: "cjs",
    exports: "named",
  },
  external: [/@aws-sdk\/.*/],
  plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()],
};
