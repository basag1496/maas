<template>
  <div>
    <b-modal v-model="this.$props.openModal" hide-footer title="Mis Ingenieros">
      <button class="btn btn-primary" style='float:right;' @click='openCreate'>
        Agregar Ingeniero
      </button>
      <table class="table table-stripped" width="100%">
        <thead>
          <th>Ingeniero</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="worker in workers" v-bind:key='worker.id'>
            <td>{{worker.first_name}} {{worker.last_name}}</td>
            <td>
              <button class="btn btn-warning" @click="editWorker(worker)">
                <b-icon-pencil-fill font-scale="0.9"></b-icon-pencil-fill>
              </button>
              <button class="btn btn-danger" @click="destroy(worker)" 
               style='margin-left:10px;'>
                <b-icon-trash font-scale="0.9"></b-icon-trash>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </b-modal>
    <b-modal v-model="editClientModal" size='lg' hide-footer 
    title="Ingenieros - Gestor" @hide="clearForm">
      <form @submit="create_or_update">
        <div class='row'>
          <div class='col-md-4'>
            <b>Nombres:</b>
            <br>
            <input type="text" placeholder="Ej: Elon" 
            class="form-control" 
            v-model='current_worker.first_name'
            required>
            <br>
            <b>Apellidos:</b>
            <br>
            <input type="text" placeholder="Ej: Musk" 
            class="form-control" 
            v-model='current_worker.last_name'
            required>
          </div>
          <div class='col-md-4'>
            <b>Color:</b>
            <br>
            <input type="color" placeholder="#eeeee" 
            class="form-control" 
            v-model='current_worker.color'
            required>
            <br>
            <b>Servicio</b>
            <select class="form-select" v-model='current_worker.service_id'>
              <option v-for="service in services" 
                v-bind:key='service.id'
                :value="service.id"
                >
                {{service.description}}
              </option>
            </select>
          </div>
          <div class='col-md-4'>
            <b>Email:</b>
            <br>
            <input type="text" placeholder="example@mass.com" 
            class="form-control" 
            v-model='current_worker.email'
            required>
            <span style="color:grey;">Default Password: 123456</span>
          </div>
          <div class='col-md-12'>
            <button class="btn btn-warning" 
             type='button'
             style='float:right; margin-top:30px;' 
            @click='addSchedule'>
              Agregar Horario
            </button>
            <table class="table table-striped">
              <thead>
                <th>Dia</th>
                <th>Hora</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(schedule, index) in current_worker.schedules_attributes" v-bind:key='schedule.id'>
                  
                  <td>
                    <select class="form-select" v-model='schedule.day'>
                      <option value='0'>Domingo</option>
                      <option value='1'>Lunes</option>
                      <option value='2'>Martes</option>
                      <option value='3'>Miercoles</option>
                      <option value='4'>Jueves</option>
                      <option value='5'>Viernes</option>
                      <option value='6'>Sabado</option>
                    </select>
                  </td>
                  <td>
                    <vue-timepicker
                    v-model='schedule.from'
                    format="H:mm:ss"
                    :minute-range="[0]"
                    :second-range="[0]"
                    required
                    >
                    </vue-timepicker>
                  </td>
                  <td>
                    <button class="btn btn-danger" type="button" 
                     @click="destroy_schedule(schedule, index)">
                      <b-icon-trash font-scale="0.9"></b-icon-trash>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" class="btn btn-success" 
             style='float:right;'>
              Guardar
            </button>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
export default {
  name: 'clientsComponent',
  components: {
    VueTimepicker
  },
  props: {
    openModal: Boolean
  },
  data(){
    return {
      editClientModal: false,
      formEditMode: false,
      edit_id: 0,
      workers: [],
      services: [],
      current_worker: {
        first_name: '',
        last_name: '',
        email: '',
        color: '#eee',
        service_id: 1,
        schedules_attributes: []
      }
    }
  },
  created(){
    this.getWorkers()
    this.getServices()
  },
  methods: {
    getWorkers: function(){
      let instance = this
      axios.get('/workers')
      .then(function(response){
        instance.workers = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    getServices: function(){
      let instance = this
      axios.get('/getServices')
      .then(function(response){
        instance.services = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    editWorker: function(worker){
      this.current_worker.service_id = worker.service_id
      this.current_worker = worker
      this.edit_id = worker.id
      this.formEditMode = true
      this.editClientModal = true
    },
    openCreate: function(){
      this.editClientModal = !this.editClientModal
    },
    addSchedule: function(){
      this.current_worker.schedules_attributes.push({
        service_id: this.current_worker.service_id,
        day: 0,
        from: '10:00:00',
        _destroy: false
      })
    },
    destroy_schedule: function(schedule, index){
      let instance = this
      let position = index
      if(this.formEditMode == true){
        if (confirm("¿Seguro que desea eliminar?") == true) {
          // Editing
          axios.delete(`/schedules/${schedule.id}`)
          .then(function(){
            instance.$delete(instance.current_worker.schedules_attributes, position)
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      }else{
        //Creating
        this.$delete(this.current_worker.schedules_attributes, index)
      }
    },
    destroy: function(client){
      let instance = this
      if (confirm("¿Seguro que desea eliminar?") == true) {
        // Editing
        axios.delete(`/workers/${client.id}`)
        .then(function(){
          instance.getWorkers()
           instance.$root.$emit('refresh_all')
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
    create_or_update: function(e){
      let instance = this
      if(this.formEditMode == true){
        // Editing
        axios.put(`/workers/${this.edit_id}`,{
          worker: this.current_worker
        })
        .then(function(){
          instance.clearForm()
        })
        .catch(function(error) {
          console.log(error);
        });
      }else{
        //Creating
        axios.post('/workers',{
          worker: this.current_worker
        })
        .then(function(res){
          console.log(res)
          instance.clearForm()
        })
        .catch(function(error) {
          console.log(error);
        });
      }
      e.preventDefault();
    },
    clearForm: function(){
      this.current_worker = {
        first_name: '',
        last_name: '',
        email: '',
        color: '#eee',
        service_id: 1,
        schedules_attributes: []
      }
      this.formEditMode = false
      this.editClientModal = false
      this.getWorkers()
      this.getServices()
      this.$root.$emit('refresh_all')
    }
    
  }

}

  </script>