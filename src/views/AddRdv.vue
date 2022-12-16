<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { supabase } from "../supabase"
import router from "../router";

const dateRdv = ref('')
const heureRdv = ref('')
const prestataire_select = ref('')
const prestataires = ref<any>([])

onMounted(async() => {
  const { data: prestataire } = await supabase
      .from('prestataires')
      .select()

  prestataires.value = prestataire
})

async function priseRDV() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email_user', user?.email)
    const { data: rdv } = await supabase
        .from('prise_rdv')
        .insert([
          { date_rdv: dateRdv.value,
            heure_rdv: heureRdv.value,
            client: userClient[0].id,
            prestataire: prestataires.value[0].id }
        ])
    /*const { data: rdv } = await supabase
        .from('prise_rdv')
        .select(`
          id,
          clients!inner (
            email_user
          )
        `)
        .eq('clients.email_user', user?.email)*/
    await router.push({ name: 'ListRdv' })
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}

</script>

<template>
  <h1>Ajouter un rdv</h1>
  <form class="row flex-center flex" @submit.prevent="priseRDV">
    <div class="col-6 form-widget">
      <div>
        <input class="inputField" type="date" placeholder="Date rdv" v-model="dateRdv" />
        <input class="inputField" type="time" placeholder="Heure rdv" v-model="heureRdv" />
        <select v-model="prestataire_select">
          <option v-for="presta in prestataires" :value="presta.id" :key="presta.id">
            {{ presta.first_name }} {{ presta.last_name }}
          </option>
        </select>
      </div>
      <div>
        <input
            type="submit"
            class="button block"
        />
      </div>
    </div>
  </form>

</template>

<style scoped>

</style>
