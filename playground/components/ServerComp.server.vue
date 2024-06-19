<script lang="ts" setup>
const posts = useReactiveFetch('/api/all-posts', {
  query: { server: true },
})
await posts.resolve()
// because this is a server component, we need to resolve the request onBeforeMount/immediately(the component is never mounted on the server side)
// to avoid returning empty html to the client
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <h1 class="text-3xl font-bold tracking-tighter">
      Server Component
    </h1>
    <template v-if="posts.status === 'success'">
      <p
        v-for="post in posts.data.posts"
        :key="post"
      >
        {{ post }}
      </p>
    </template>
    <template v-if="posts.status === 'error'">
      <p>{{ posts.error.message }}</p>
    </template>
    <!-- no need to handle pending case because we await the resolve -->
  </div>
</template>
