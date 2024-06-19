import type { NuxtIslandResponse } from '@/../nuxt/src/core/runtime/nitro/renderer'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', async (event, { body }) => {
    if (!getHeader(event, 'x-revalidate-island')) { return }
    const reqBody = await readBody(event)

    const island = reqBody.__revalidateIsland as {
      key: string
      context: any
      props: any
    }
    if (!island) { return }

    const islandResponse = (await $fetch(`/__nuxt_island/${island.key}.json`, {
      query: {
        ...island.context,
        props: island.props ? JSON.stringify(island.props) : undefined,
      },
    })) as NuxtIslandResponse // TODO: Promise.allSettled, error handling

    islandResponse.id = island.key;

    // console.log("server:beforeResponse", islandResponse);

    // body ||= {}; this doesn't do anything, body must be an object before being passed into the hooks
    (body as Record<string, any>).__revalidateIsland = islandResponse
    event.node.res.appendHeader('x-revalidate-island', 'true')
  })
})
