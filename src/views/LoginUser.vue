<template>
  <form class='wrapper_login'>
    <div class='row'>
      <div class='col-lg-12 col-sm-12 col-xs-12'>
        <div class='alert alert-danger' v-if='showLoginError'>Usuario / Clave Incorrectos</div>
      </div>
      <div class='col-lg-12 col-sm-12 col-xs-12'>
        <img src='../assets/logo.png'>
        <br>
      </div>
      <div class='col-lg-12 col-sm-12 col-xs-12'>
        <label for='email'>Correo Electronico</label>
        <input type='email' class='form-control' v-model='email' 
        placeholder='Email' required>
        <br>
      </div>
      <div class='col-lg-12 col-sm-12 col-xs-12'>
        <label for='password'>Contraseña</label>
        <input type='password' class='form-control' v-model='password' 
        placeholder='password' required>
      </div>
      <div class='row col-12 col-sm-12 col-xs-12 align-self-center '>
        <button type='submit' class='btn btn-lg btn-block  btn-primary' @click.prevent='login'>
          Iniciar Session
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import '../assets/sass/login.scss'
import 'bootstrap/dist/css/bootstrap.css'
export default {
  name: 'LoginUser',
  data() {
    return {
      email: "",
      password: "",
      showLoginError: false
    };
  },
  methods: {
    async login() {
      this.showLoginError = false
      let response = await this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
      if (response) {
        this.$router.replace("DashboardUser");
      } else {
        this.showLoginError = true
      }
    },
  }
  
}
</script>

