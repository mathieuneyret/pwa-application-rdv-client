<script setup lang="ts">
import '@fullcalendar/core/vdom'
import FullCalendar from "@fullcalendar/vue3"
import { reactive } from 'vue'
import {onMounted, ref} from 'vue'
import { supabase } from "../supabase"
import { ics } from "calendar-link"
import dayGridPlugin from '@fullcalendar/daygrid'

const listRdv = ref([])
const calendarRdv = ref([])

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

  console.log(rdv)

  calendarRdv.value = rdv?.map((event) => ({
    title: 'Rdv avec ' + event.prestataires?.first_name + ' ' + event.prestataires?.last_name,
    start: event.date_rdv,
    url: ics({
      title: 'Mon rendez-vous avec ' + event.prestataires?.first_name + ' ' + event.prestataires?.last_name,
      description: 'Pour ne pas être en retard à mon rendez-vous avec ' + event.prestataires?.first_name + ' ' + event.prestataires?.last_name,
      start: event.date_rdv + event.heure_rdv
    })
  }))

})


const calendarOptions = reactive({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: 'fr',
  firstDay: 1,
  events: calendarRdv
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
  <FullCalendar class='demo-app' :options="calendarOptions" id="calendar" />
</template>

<style scoped>
h2 {
  margin: 0;
  font-size: 16px;
}
ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}
li {
  margin: 1.5em 0;
  padding: 0;
}
b { /* used for event dates/times */
  margin-right: 3px;
}
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}
.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}
.demo-app-sidebar-section {
  padding: 2em;
}

@media screen and (min-width: 992px) {
  table {
    width: 1098px;
  }
}
.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}
.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

</style>