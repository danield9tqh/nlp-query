import { build } from "bun";
import bunPluginTailwind from "bun-plugin-tailwind";

await build({
  entrypoints: ["./src/server.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  sourcemap: "external",
  plugins: [bunPluginTailwind],
});

console.log("Build complete");


