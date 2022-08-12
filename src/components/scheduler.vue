<template>
  <div class='divider'>
    <table v-for='(day, label) in data' v-bind:key='day.token' class='table'>
      <thead>
        <th style='background-color:#F0F3BD;' width='50'>{{label}}</th>
          <div v-if="editMode">
            <div  v-for='worker_list in day' v-bind:key='worker_list.token'>
              <th v-for='worker in worker_list.confirmetions' 
                  v-bind:key='worker.token'
                  :style="{'background-color': `${worker.worker_color}`}"
                  >
                    {{worker.worker_name}}
              </th>
          </div>
          </div>
      </thead>
      <tbody>
        <tr>
          <td>
            <table>
              <thead>
                <th></th>
                <th v-if='editMode == false'></th>
              </thead>
              <tbody>
                <tr v-for='assignment in day' v-bind:key='assignment.id'>
                  <td style='background-color:#66ed86;'>{{assignment.from}}</td>
                  <td v-if="assignment.confirmeds.count < 1 && editMode == false">
                    <b-icon icon="exclamation-triangle" style='color:#d9aa00;'> </b-icon>
                  </td>
                  <td v-if="assignment.confirmeds.count > 0 && editMode == false"
                    :style="{'background-color': `${assignment.confirmeds.worker_first_color}`}"  
                  >
                    {{assignment.confirmeds.worker_first_name}}
                  </td>
                </tr>
              </tbody>
            </table> 
          </td>
          <div v-if="editMode">
            <div v-for='worker_list in day' v-bind:key='worker_list.token' >
              <td v-for='worker in worker_list.confirmetions' 
                  v-bind:key='worker.token'
                  style='text-align:center; flot:left;'>

                  <input type='checkbox' v-if="worker.editable" 
                  style='margin-top:10px; margin-left:10px;' 
                  :checked='worker.confirmed'
                  v-on:change="confirm(worker.id,$event)"
                  > 

                  <input type='checkbox' v-if="worker.editable == false" 
                  style='margin-top:10px; margin-left:10px;' 
                  :checked='worker.confirmed' disabled> 

              </td>
            </div> 
          </div>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
export default {
  name: 'schedulerComponent',
  props: {
    data: [],
    editMode: Boolean
  },
  created(){
    console.log(this.$props.data);
  },
  methods:{
    confirm: function(confirmation_id, event){
      let instance = this
      axios.post(`/assignments/confirme/${confirmation_id}/${event.target.checked}`)
      .then(function(){
        instance.$root.$emit('refresh_assignment')
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

}

  </script>