<template>
  <div class="row">
    <div class="col-lg-3 col-sm-12">
      <aside class="sidebar">
        <img src='../assets/logo.png'>
        <h2>{{ user.full_name }}</h2>
        <span>{{ user.role }}</span>
        <br>
        <button class="btn btn-warning" @click='logout()'> Cerrar Sesion </button>
        <br>
        <button class="btn btn-success" @click='openClient' v-if="user.role == 'admin'"> 
          Mis Servicios 
        </button>
        <br>
        <button class="btn btn-danger" @click='openWorker' v-if="user.role == 'admin'"> 
          Mis Ingenieros 
        </button>
      </aside>
    </div>
    <div class="col-lg-9 col-sm-12">
      <div id="schedule_container">
        <div class='row'>
          <div class="col-lg-12">
            <h2>Horarios</h2>
          </div>
           <div class="col-lg-3">
            <label for="services">Servicio:</label>
            <select id="services" class="form-select" @change='refresh' v-model="currentClient">
              <option v-for='client in clients' :value="client.id" v-bind:key="client.id">
                {{ client.description }}
              </option>
            </select>
          </div>
          <div class="col-lg-3">
            <label for="weeks">Semana:</label>
            <select id="weeks" class="form-select" @change='refresh' v-model="currentWeek" >
              <option v-for='week in weeks' :value="week.id" v-bind:key="week.id">
                {{ week.description }}
              </option>
            </select>
          </div>
        </div>
        <span>{{betweenLabel}}</span>
        <hr>
        <div class="col-md-12">
          <button class="btn btn-primary" 
           style="float:right; margin-right:10px;"
           @click="changeMode"
           v-if="editMode == false"
           > 
            Editar Disponibilidad
          </button>
          <button class="btn btn-warning" 
           style="float:right; margin-right:10px;"
           @click="changeMode"
           v-if="editMode == true"
           > 
            Modo Disponibilidad
          </button>
        </div>
        <div class="col-md-12">
          <div id="schuduler_grid">
            <scheduler v-for='assignment in assignments' :edit-mode='editMode' 
                       v-bind:key='assignment.id' :data='assignment'>
            </scheduler>
          </div>
        </div>
      </div>
    </div>
    <clients :open-modal='openClientModal'> </clients>
    <workers :open-modal='openWorkerModal'> </workers>
  </div>
</template>
<script>
import '../assets/sass/dashboard.scss'
import 'bootstrap/dist/css/bootstrap.css'
import scheduler from '../components/scheduler.vue'
import clients from '../components/clients.vue'
import workers from '../components/workers.vue'
import axios from 'axios'

export default {
  name: 'DashboardUser',
  components: {
    scheduler,
    clients,
    workers,
  },
  data() {
    return {
      user: {},
      clients: [],
      weeks: [],
      assignments: [],
      currentClient: 1,
      currentWeek: 1, 
      betweenLabel: '', 
      editMode: false,
      openClientModal: false,
      openWorkerModal: false,
    };
  },
  mounted() {
    this.$root.$on('refresh_all', () => {
      this.getClients()
      this.getWeeks()
      this.getAssignments()
    })
    this.$root.$on('refresh_assignment', () => {
      this.getAssignments()
    })
  },
  created() {
    // check if session expired
    this.session_expired()
    this.getUser()
    this.getClients()
    this.getWeeks()
    this.getAssignments()
  },
  methods: 
  {
    getUser: function() {
      let instance = this
      axios.get('/user/profile')
      .then(function(response){
        instance.user = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getClients: function() {
      let instance = this
      axios.get('/clients')
      .then(function(response){
        instance.clients = response.data;
        instance.currentClient = instance.clients[0].id
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getWeeks: function() {
      let instance = this
      axios.get('/weeks')
      .then(function(response){
        instance.weeks = response.data;
        instance.currentWeek = instance.weeks[0].id
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getAssignments: function() {
      let instance = this
      axios.get(`/assignments/${this.currentClient}/${this.currentWeek}`)
      .then(function(response){
        instance.assignments = response.data;
        instance.loadWeekLabel();
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    refresh: function() {
      this.loadWeekLabel();
      this.getAssignments()
    },
    loadWeekLabel: function(){
      let week = this.weeks.filter((week) => week.id === this.currentWeek);
      this.betweenLabel = `Del ${week[0].from} a ${week[0].to}`
    },
    changeMode: function(){
      this.editMode = !this.editMode;
    },
    openClient: function(){
      this.openClientModal = !this.openClientModal;
    },
    openWorker: function(){
      this.openWorkerModal = !this.openWorkerModal;
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        window.location = '/'
      });
    },
    session_expired: function(){
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/");
      }
    }

  }
}

</script>
