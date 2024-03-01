<!-- eslint-disable no-console -->
<script lang="ts" setup>
const input = ref("");

let id: string | null | undefined;

const postProps = ref({
  newPost: "",
  createPostFlag: false,
});

const server = ref<HTMLElement>();

onMounted(async () => {
  await nextTick();
  id = server.value?.children
    .namedItem("server")
    ?.getAttribute("data-island-uid");
});

const disabled = ref(false);

async function revalidate() {
  if (input.value === "") return;
  disabled.value = true;
  postProps.value = {
    newPost: input.value,
    createPostFlag: true,
  };
  await $fetchWithRevalidate("/api/create-post", {
    method: "POST",
    body: {
      post: input.value,
      server: true,
    },
    revalidate: id,
  });
  input.value = "";
  disabled.value = false;
}
</script>

<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div
      ref="server"
      class="flex h-full w-1/2 flex-col items-center justify-center gap-4"
    >
      <ServerComp name="server" />
      <UInput v-model="input" color="orange" :disabled />
      <UButton color="orange" :disabled @click="revalidate()"
        >Create Post</UButton
      >
    </div>
    <div class="flex h-full w-1/2 flex-col items-center justify-center gap-4">
      <ClientComp v-bind="postProps" />
      <UInput v-model="input" color="orange" :disabled />
      <UButton color="orange" :disabled @click="revalidate()"
        >Create Post</UButton
      >
    </div>
  </div>
</template>
