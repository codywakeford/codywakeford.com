<template>
  <modal id="files-modal">
    <div class="modal-body">
      <header>
        <h3>Upload a file</h3>
      </header>

      <div class="modal-content">
        <div class="upload-box">
          <Icon icon="ic:outline-upload-file" width="50" color="grey" />
          <h3>Drag and Drop or <span>Click to upload</span></h3>
          <p>Supports all formats | Max Size: 50Mb</p>
        </div>

        <div class="controls">
          <button-primary-m
            class="cancel-button"
            @click="closeModal('files-modal')"
          >
            Cancel
          </button-primary-m>
          <button-primary-m>Upload</button-primary-m>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style lang="scss" scoped>
header {
  background: $secondary;
  padding-inline: 25px;
  padding-block: 25px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  min-width: 500px;
  min-height: 300px;

  background: white;
  border-radius: $border-radius;

  .upload-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;

    outline: 2px dashed $text-light3;
    height: 250px;
    border-radius: 25px;

    h3 {
      margin-top: 15px;
      font-size: 1.1rem;

      span {
        font-size: 1rem;
        color: blue;
        text-decoration: underline;
      }
    }

    p {
      font-size: 0.9rem;
      color: $text-dark3;
    }
  }
}

.modal-content {
  padding-block: 50px 25px;
  padding-inline: 25px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  padding-block: 25px 0px;
  gap: 10px;
  margin-left: auto;
}

.cancel-button {
  border: 1px solid $primary;
  background-color: white;
  color: $text-dark2;
}
</style>
