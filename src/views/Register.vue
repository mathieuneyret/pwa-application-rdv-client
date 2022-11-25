<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from "../supabase"

const loading = ref(false)
const email = ref('')
const password = ref('')

async function signUp() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    alert("Youpi t'a crée un compte !")
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <h1>Inscription</h1>

  <form class="row flex-center flex" @submit.prevent="signUp">
    <div class="col-6 form-widget">
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div>
        <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Inscription'"
            :disabled="loading"
        />
      </div>
    </div>
  </form>

</template>

<style scoped>

</style>