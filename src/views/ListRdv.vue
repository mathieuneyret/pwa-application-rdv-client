<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { supabase } from "../supabase"
import { ics } from "calendar-link"

const listRdv = ref([])
const generateEvent = ref('')

onMounted(async() => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: rdv } = await supabase
      .from('prise_rdv')
      .select(`
        id,
        date_rdv,
        heure_rdv,
        clients!inner (
          email_user
        ),
        prestataires!inner (
          first_name,
          last_name,
          email_user
        )
      `)
      .eq('clients.email_user', user?.email)

  listRdv.value = rdv

})

async function linkCalendar(date: any, heure: any, presta: any) {
  try {
    const event = {
      title: "Mon rendez-vous",
      description: "Pour ne pas être en retard à mon rendez-vous avec " + presta.first_name + presta.last_name,
      start: date + heure,
    }
    window.open(ics(event))

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}

</script>

<template>
  <h1>Liste des rdv</h1>
  <div class="col-6 form-widget">
    <table>
      <thead>
        <tr>
          <th>Date rdv</th>
          <th>Heure rdv</th>
          <th>Prestataire</th>
          <th>Fichier ics</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rdv in listRdv" :value="rdv.id" :key="rdv.id">
          <td>{{ rdv.date_rdv }}</td>
          <td>{{ rdv.heure_rdv }}</td>
          <td>{{ rdv.prestataires.first_name }}{{ rdv.prestataires.last_name }}</td>
          <td><a @click="linkCalendar(rdv.date_rdv, rdv.heure_rdv, rdv.prestataires)">Link</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>