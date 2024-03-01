<script lang="ts" setup>
const props = defineProps<{
  newPost: string;
  createPostFlag: boolean;
}>();

watchEffect(async () => {
  if (props.createPostFlag) {
    await $fetch("/api/create-post", {
      method: "POST",
      body: { post: props.newPost, server: false },
    });
    await refresh();
  }
});

const { data, error, refresh } = await useFetch("/api/all-posts", {
  query: { server: false },
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <h1 class="text-3xl font-bold tracking-tighter">Client Component</h1>
    <div aria-hidden="true"></div>
    <template v-if="data">
      <p v-for="post in data?.posts" :key="post">{{ post }}</p>
    </template>
    <template v-if="error">
      <p>{{ error.message }}</p>
    </template>
  </div>
</template>
