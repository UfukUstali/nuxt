import type { NuxtIslandResponse } from '@/../nuxt/src/core/runtime/nitro/renderer'

const payloadMethods = ['PATCH', 'POST', 'PUT', 'DELETE']
export function isPayloadMethod (method = 'GET') {
  return payloadMethods.includes(method.toUpperCase())
}

export const $fetchWithRevalidate = $fetch.create({
  onRequest: (ctx) => {
    if (!isPayloadMethod(ctx.options.method)) { throw createError('Method must be able to have a payload.') }
    if (!ctx.options.revalidate) { return } // TODO: MaybeArray<MaybeRef<string | HTMLElement | ...?>> for now only string

    const headers = (ctx.options.headers ||= new Headers()) as Headers
    headers.set('x-revalidate-island', 'true')

    const app = useNuxtApp()
    const island = app.payload.data.revalidateIsland[
      ctx.options.revalidate
    ]() as {
      key: string
      context: any
      props: any
      trigger?: () => void
    }

    // console.log("client:onRequest", island);

    ctx.options.revalidateTrigger = island.trigger
    delete island.trigger

    ctx.options.body = {
      ...(ctx.options.body as Record<string, any>),
      __revalidateIsland: island,
    }
  },
  onResponse: (ctx) => {
    const res = ctx.response
    if (
      res.status === 200 &&
      res.headers.get('x-revalidate-island') === 'true'
    ) {
      const island = (
        res._data as {
          __revalidateIsland: NuxtIslandResponse // TODO: MaybeArray<NuxtIslandResponse | NuxtError>
        }
      ).__revalidateIsland
      delete res._data.__revalidateIsland

      // console.log("client:onResponse", island);

      if (!island.id) { return }

      const app = useNuxtApp()

      app.payload.data.revalidateIsland[island.id] = () => {
        delete app.payload.data.revalidateIsland[island.id]
        return island
      }
      ctx.options.revalidateTrigger?.()
    }
  },
})
