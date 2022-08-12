<template>
  <div>
    <b-modal v-model="this.$props.openModal" hide-footer title="Mis Servicios">
      <button class="btn btn-primary" style='float:right;' @click='openCreate'>
        Agregar Servicio
      </button>
      <table class="table table-stripped" width="100%">
        <thead>
          <th>Servicio</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="client in clients" v-bind:key='client.id'>
            <td>{{client.description}}</td>
            <td>
              <button class="btn btn-warning" @click="editClient(client)">
                <b-icon-pencil-fill font-scale="0.9"></b-icon-pencil-fill>
              </button>
              <button class="btn btn-danger" @click="destroy(client)" 
               style='margin-left:10px;'>
                <b-icon-trash font-scale="0.9"></b-icon-trash>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </b-modal>
    <b-modal v-model="editClientModal" size='lg' hide-footer 
    title="Servicios - Gestor" @hide="clearForm">
      <form @submit="create_or_update">
        <div class='row'>
          <div class='col-md-8'>
            <b>Descripción:</b>
            <br>
            <input type="text" placeholder="Ej: Servicio DevOps" 
            class="form-control" 
            v-model='current_client.description'
            required>
          </div>
          <div class='col-md-12'>
            <button class="btn btn-warning" 
             type='button'
             style='float:right; margin-top:30px;' 
            @click='addContract'>
              Agregar Contrato
            </button>
            <table class="table table-striped">
              <thead>
                <th>Tipo de Servicio</th>
                <th>Dia</th>
                <th>Hora</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(schedule, index) in current_client.schedules_attributes" v-bind:key='schedule.id'>
                  <td>
                    <select class="form-select" v-model='schedule.service_id'>
                    <option v-for="service in services" 
                     v-bind:key='service.id'
                     :value="service.id"
                     >
                      {{service.description}}
                    </option>
                    </select>
                  </td>
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
      clients: [],
      services: [],
      current_client: {
        description: '',
        schedules_attributes: []
      }
    }
  },
  created(){
    this.getClients()
    this.getServices()
  },
  methods: {
    getClients: function(){
      let instance = this
      axios.get('/clients')
      .then(function(response){
        instance.clients = response.data;
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
    editClient: function(client){
      this.current_client = client
      this.edit_id = client.id
      this.formEditMode = true
      this.editClientModal = true
    },
    openCreate: function(){
      this.editClientModal = !this.editClientModal
    },
    addContract: function(){
      this.current_client.schedules_attributes.push({
        service_id: 1,
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
            instance.$delete(instance.current_client.schedules_attributes, position)
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      }else{
        //Creating
        console.log(index)
        this.$delete(this.current_client.schedules_attributes, index)
      }
    },
    destroy: function(client){
      let instance = this
      if (confirm("¿Seguro que desea eliminar?") == true) {
        // Editing
        axios.delete(`/clients/${client.id}`)
        .then(function(){
          instance.getClients()
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
        axios.put(`/clients/${this.edit_id}`,{
          client: this.current_client
        })
        .then(function(){
          instance.clearForm()
        })
        .catch(function(error) {
          console.log(error);
        });
      }else{
        //Creating
        axios.post('/clients',{
          client: this.current_client
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
      this.current_client = {
        description: '',
        schedules_attributes: []
      }
      this.formEditMode = false
      this.editClientModal = false
      this.getClients()
      this.getServices()
      this.$root.$emit('refresh_all')
    }
    
  }

}

  </script>