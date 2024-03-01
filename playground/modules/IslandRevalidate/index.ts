import {
  addImports,
  addServerPlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "island-revalidate",
    configKey: "islandRevalidate",
    compatibility: {
      nuxt: "^3.0.0",
    },
    version: "0.0.1",
  },
  setup(_, nuxt) {
    if (!nuxt.options.experimental.componentIslands)
      throw new Error("This module requires component islands to be enabled");

    const resolver = createResolver(import.meta.url);

    addImports({
      from: resolver.resolve("./imports/$fetchWithRevalidate.ts"),
      name: "$fetchWithRevalidate",
    });

    addServerPlugin(resolver.resolve("./plugins/nitro.ts"));
  },
});
