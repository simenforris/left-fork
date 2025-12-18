<script setup lang="ts">
import { icons } from 'feather-icons';
import { useTemplateRef } from 'vue';

const dialog = useTemplateRef('dialog');

const close = () => {
  dialog.value?.close();
};

const open = () => {
  dialog.value?.showModal();

  const abortController = new AbortController();

  window.addEventListener(
    'click',
    (event) => {
      if (event.target === dialog.value) {
        close();
        abortController.abort();
      }
    },
    { signal: abortController.signal }
  );
};
</script>

<template>
  <div>
    <div class="trigger-wrapper" @click="open">
      <slot />
      <button
        @click="open"
        aria-haspopup="dialog"
        aria-controls="fs-img-dialog"
        aria-label="Open full screen image"
      >
        <span
          aria-hidden="true"
          v-html="icons['maximize-2'].toSvg({ width: '1em', height: '1em' })"
        />
      </button>
    </div>

    <dialog id="fs-img-dialog" ref="dialog">
      <form method="dialog">
        <slot name="dialog" />
        <button type="submit" aria-label="Close full screen image">
          <span
            aria-hidden="true"
            v-html="icons['x'].toSvg({ width: '1em', height: '1em' })"
          />
        </button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
@import './fullscreen-image.css';
</style>
