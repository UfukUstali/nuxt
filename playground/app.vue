<!-- eslint-disable no-console -->
<script lang="ts" setup>
const input = ref('')

let id: string | null | undefined

const postProps = ref({
  newPost: '',
  createPostFlag: false,
})

const server = ref<HTMLElement>()

onMounted(async () => {
  await nextTick()
  id = server.value?.children
    .namedItem('server')
    ?.getAttribute('data-island-uid')
})

const disabled = ref(false)

function revalidate () {
  if (input.value === '') { return }
  disabled.value = true
  postProps.value = {
    newPost: input.value,
    createPostFlag: true,
  }
  $fetchWithRevalidate('/api/create-post', {
    method: 'POST',
    body: {
      post: input.value,
      server: true,
    },
    revalidate: id,
  })
  input.value = ''
  disabled.value = false
}
</script>

<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div
    class="font-sans bg-black text-white flex h-screen w-screen items-center justify-center"
  >
  <div class="flex h-full w-1/2 flex-col items-center justify-center gap-4">
    <ClientComp v-bind="postProps" />
    <input v-model="input" :disabled />
    <button :disabled @click="revalidate()">Create Post</button>
  </div>
  <div
    ref="server"
    class="flex h-full w-1/2 flex-col items-center justify-center gap-4"
  >
    <ServerComp name="server" />
    <input v-model="input" :disabled />
    <button :disabled @click="revalidate()">Create Post</button>
  </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.flex {
  display: flex;
}
.h-screen {
  height: 100vh;
}
.w-screen {
  width: 100vw;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.h-full {
  height: 100%;
}
.w-1\/2 {
  width: 50%;
}
.flex-col {
  flex-direction: column;
}
.gap-4 {
  gap: 1rem /* 16px */;
}
.gap-2 {
  gap: 0.5rem /* 8px */;
}
.text-3xl {
  font-size: 1.875rem /* 30px */;
  line-height: 2.25rem /* 36px */;
}
.font-bold {
  font-weight: 700;
}
.tracking-tighter {
  letter-spacing: -0.05em;
}
.font-sans {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>
