<!-- ShareTime component-->
<!-- User should be authenticated in order to see this page -->

<template>
    <article class = share>
        <section class = "Names">
            <!-- Profile Data-->
            <header>
                <h2>
                    Time spent on Fritter:
                </h2>
                <h3>
                    Daily Average Time: {{lastWeekly}}
                </h3>
                <h3>
                    Trend: {{trend}}
                </h3>
                <section v-if = "$store.state.username === user">
                    <h3>
                    Current Daily: {{currentDailyHours}} Hrs, {{currentDailyMinutes}} Min
                    </h3>
                    <h3 v-for = "daily in currentWeekly" >
                        {{daily}}
                    </h3>
                </section>
                

            </header>
        </section>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>
  
<script>

export default {
    name: 'ShareTimeInfo',
    data() {
        return {
            user : this.$route.params.username,
            lastWeekly: '',
            trend: '',
            currentDailyHours: '',
            currentDailyMinutes: '',
            currentWeekly: [],
            alerts: {},
        }
    },
    methods: {
        async submit(){
            const url = (this.user == this.$store.state.username) ? "/api/shareTime/myShareTime" : this.user ? `/api/shareTime?author=${this.user}` : '/api/shareTime/myShareTime';

            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                
                this.lastWeekly = res.lastWeekly;
                this.trend = res.trend;
                if (res.currentDaily){                    
                    const hours = Number(res.currentDaily)/1000/60/60;
                    const roundedHours = Math.round(hours);
                    this.currentDailyHours = roundedHours;
                    const minutes = Math.round((hours - roundedHours) * 60);
                    this.currentDailyMinutes = (minutes > 0) ? minutes : 0;
                }
                if (res.currentWeekly){
                    const days = res.currentWeekly.split(",");
                    let counter = 0;
                    const Weekday = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
                    const today = res.currentWeekday;
                    const todayDate = new Date();
                    const todayDayLabel = Weekday[todayDate.getDay()];
                    let shift = todayDate.getDay() - today;
                    shift = (shift < 0)? shift + 7 : shift;
                    console.log("This is today", today);
                    for (const item of days){
                        const hours = Number(item)/1000/60/60;
                        const roundedHours = Math.round(hours);
                        const minutes = Math.round((hours - roundedHours) * 60);
                        this.currentWeekly[counter] = `${(counter == today)? "Today" : Weekday[(counter + shift) % 7]} : ${roundedHours} Hrs, ${minutes} Min`
                        counter++;
                    }
                    console.log("These days", days);
                }
                console.log("shareTime", res);           
            } 
            catch (e) {
                console.log("Wth");
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>

<style scoped>
.share{
    position: relative;
    border: 1px solid #111;
    padding: 20px;
}

</style>