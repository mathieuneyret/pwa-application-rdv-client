<script setup lang="ts">
import LoadingScreen from './views/LoadingScreen.vue'
import {onMounted} from "vue";

let deferredPrompt: Event | null;

window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
});

onMounted(async() => {
  let isLoading = true
  setTimeout(() => {
    isLoading = false;
  }, 3000);
})

async function installPwa() {
  try {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}

</script>

<template>
  <LoadingScreen :isLoading="isLoading" />
  <main v-if="!isLoading">
    <div class="div-button-install">
      <button type="submit" id="button-install" @click="installPwa()">Installer l'application</button>
    </div>
    <div class="menu-link">
      <router-link to="/">Ajouter rdv</router-link>
      <router-link to="/listrdv">Liste des rdv</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
  </main>
  <router-view></router-view>
</template>

<style scoped>
.menu-link a {
  padding: 5px;
}
</style>
