<template>
    <form>
      <input
        v-model="user"
        type="text"
        :placeholder="placeholder"
      >
      <button
        type="submit"
        @click="LookUpUser"
      >
        {{ button }}
      </button>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </form>
</template>
  
  <script>
  export default {
    name: 'LookUpBar',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      button: {
        type: String,
        default: 'Submit'
      }
    },
    data() {
      return {user: '', alerts: {}};
    },
    methods: {
        async LookUpUser(){
            console.log("This is the user", this.user)
            try {
                const r = await fetch(`/api/profile?author=${this.user}`);
                console.log(r);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                // this.$router.push(`/profile/${this.user}`);
                console.log("goong");
                this.$router.push({ path: `/profile/${this.user}`});
                // this.$router.push({name: 'Home'})
                
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
  };
  </script>
  
  <style scoped>
  form {
      display: flex;
      position: relative;
  }
  
  input {
      padding: 0 5px;
      min-width: 200px;
  }
  </style>
  