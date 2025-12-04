
<template>
    <div class="card flex justify-center">
        <Password v-model="value" toggleMask />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(null);
</script>
