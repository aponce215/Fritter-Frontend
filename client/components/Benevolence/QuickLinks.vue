<!-- Form for getting freets (all, from user) (inline style) -->
<template>
    <section>
        <section class = "links">
            <header>
                <h1>
                    Nominated users:
                </h1>
                <p v-if = "nominated.length == 0">
                    You haven't nominated anyone yet!
                </p>
                <p v-if = "nominated.length == 0">
                    Nominate someone by going to their profile and 
                    clicking on benevolence to vote for them. You can only nominate
                    3 users, so choose wisely!
                </p>
            </header>
            <div class = "link" v-if = "nominated.length > 0">
                <router-link v-for = "user in nominated"
                    :to= "`/profile/${user}`"
                >
                    {{user}}
                </router-link>
            </div>        
        </section>
        <section class = "links" v-if = "showReports">
            <header>
                <h1>
                    Reported users:
                </h1>
                <p v-if = "reported.length == 0">
                    You haven't reported anyone yet
                </p>
                <p v-if = "reported.length == 0">
                    You can report someone by heading to their profile and 
                    selecting on report
                </p>
            </header>
            <div class = "link" v-if = "reported.length > 0">
                <router-link v-for = "user in reported"
                    :to= "`/profile/${user}`"
                >
                    {{user}}
                </router-link>
            </div>        
        </section>
    </section>
    
</template>

<script>

export default {
  name: 'QuickLinks',
  props: ["showReports"],
  data (){
    return {
        nominated: [],
        reported: [],
    }
  },
  methods: {
    async submit(){
        try {
            const r = await fetch(`/api/benevolence/myBenevolence`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            if (res.myVotes){
                this.nominated = res.myVotes.split(",");
            }
            if (res.myReports){
                this.reported = res.myReports.split(",");
            }
            
        } catch (e) {
            console.log("gottcha");
            this.$set(this.alerts, e, 'error');
            console.log("got got");
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};
</script>

<style scoped>

.links{
    display: flex;
    flex-direction: column;
}
.link{
    display: flex;
    flex-direction: column;
}
</style>