<template>
  <div class="login-panel">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box no-padding">
          <section class="hero is-light">
            <div class="hero-body">
              <h1 class="title">Login</h1>
            </div>
          </section>
          <section class="input-panel add-padding">
            <b-field label="Benutzer">
              <b-input v-model="username"></b-input>
            </b-field>

            <b-field label="Passwort">
              <b-input type="password" v-model="password" password-reveal>
              </b-input>
            </b-field>

            <b-button @click="login()">Login</b-button>

            <b-loading
              :is-full-page="isFullPage"
              v-model="isLoading"
              :can-cancel="true"
            ></b-loading>
          </section>
        </div>
      </div>
      <div class="tile is-5 is-vertical is-parent">
        <div
          class="tile is-child box no-padding quick-login-card"
          @click="loginAsAdmin()"
        >
          <div class="hero is-primary h-100">
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  Admin
                </h1>
                <h2 class="subtitle">
                  Alle Zugriffsrechte
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div
          class="tile is-child box no-padding quick-login-card"
          @click="loginAsUser()"
        >
          <div class="hero-body">
            <div class="container">
              <h1 class="title">
                Standardbenutzer
              </h1>
              <h2 class="subtitle">
                Eingeschränkte Zugriffsrechte
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastHelpers from '../helpers/toastHelpers.js';

export default {
  name: "LoginView",
  data: function() {
    return {
      username: "",
      password: "",
      // vars for the loading dialog
      isLoading: false,
      isFullPage: true,
    };
  },
  methods: {
    /**
     * Performs login as admin.
     */
    loginAsAdmin() {
      this.username = "admin";
      this.password = "admin";

      this.login();
    },
    /**
     * Performs login as test user.
     */
    loginAsUser() {
      this.username = "test";
      this.password = "test";

      this.login();
    },
    /**
     * Triggers the login with the current values for
     * username and password.
     */
    async login() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);

      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/"))
        .catch((error) => {
          this.isLoading = false;
          this.openFailedToast("Der Nutzername oder das Passwort war falsch!");
          console.log(error);
        });
    },
    ...toastHelpers
  },
};
</script>

<style lang="scss" scoped>
.login-panel {
  padding: 25vh 25%;

  .input-panel {
    text-align: left;
  }

  .no-padding {
    padding: 0px;
  }

  .add-padding {
    padding: 1.25rem;
  }

  .quick-login-card {
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      transform: scale(1.07);
    }
  }

  .h-100 {
    height: 100%;
  }
}
</style>
