<script setup lang="ts">

</script>

<template>
  <div class="menu-link">
    <router-link to="/">Ajouter rdv</router-link>
    <router-link to="/listrdv">Liste des rdv</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.menu-link a {
  padding: 5px;
}
</style>
