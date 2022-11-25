<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from "../supabase"

const loading = ref(false)
const email = ref('')
const password = ref('')

async function signInWithEmail() {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    alert("Youpi tu es connecté !")
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
  <h1>Login</h1>

  <form class="row flex-center flex" @submit.prevent="signInWithEmail">
    <div class="col-6 form-widget">
      <p class="description">Connexion</p>
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
        <input class="inputField" type="password" placeholder="Your password" v-model="password" />
      </div>
      <div>
        <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Connexion'"
            :disabled="loading"
        />
      </div>
    </div>
  </form>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
