<template>
  <div class="row">
    <div class="col-lg-3 col-sm-12">
      <aside class="sidebar">
        <img src='../assets/logo.png'>
        <h2>{{ user.full_name }}</h2>
        <span>{{ user.role }}</span>
        <br>
        <button class="btn btn-warning" @click='logout()'> Cerrar Sesion </button>
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
            <select id="services" class="form-select" @change='refresh' v-model="current_client">
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
  </div>
</template>
<script>
import '../assets/sass/dashboard.scss'
import 'bootstrap/dist/css/bootstrap.css'
import scheduler from '../components/scheduler.vue'
import axios from 'axios'

export default {
  name: 'DashboardUser',
  components: {
    scheduler
  },
  data() {
    return {
      user: {},
      clients: [],
      weeks: [],
      assignments: [],
      current_client: 1,
      currentWeek: 1, 
      betweenLabel: '', 
      editMode: false
    };
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
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getAssignments: function() {
      let instance = this
      axios.get(`/assignments/${this.current_client}/${this.currentWeek}`)
      .then(function(response){
        instance.assignments = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    refresh: function() {
      let week = this.weeks.filter((week) => week.id === this.currentWeek);
      this.betweenLabel = `Del ${week[0].from} a ${week[0].to}`
      this.getAssignments()
    },
    changeMode: function(){
      this.editMode = !this.editMode;
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
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
