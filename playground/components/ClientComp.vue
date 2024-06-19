<script lang="ts" setup>
const props = defineProps<{
  newPost: string
  createPostFlag: boolean
}>()

watch(() => props.createPostFlag, async () => {
  if (props.createPostFlag) {
    await $fetch('/api/create-post', {
      method: 'POST',
      body: { post: props.newPost, server: false },
    })
    await posts.refresh()
  }
})

const posts = useReactiveFetch('/api/all-posts', {
  query: { server: false },
})
// await posts.resolve()
// uncomment the above line if you want to resolve the request onBeforeMount
// just like const posts = await useFetch('/api/all-posts', { query: { server: false } })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <h1 class="text-3xl font-bold tracking-tighter">
      Client Component
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
    <template v-if="posts.status === 'pending'">
      <p>Loading...</p>
    </template>
  </div>
</template>
