<!-- Page for user's profile-->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
        <section class = "intro">
            <ProfileInfo
                class = "profileInfo"
                ref="ProfInfo"
            />
            <ShareTimeInfo
                ref = "ProfTime"
            />
        </section>
        
        <section>
            <header>
                <h1> My Freets </h1>                
            </header>
        </section>
        <section
            v-if="myFreets.length"
        >
            <FreetComponent
                v-for="freet in myFreets"
                :key="freet.id"
                :freet="freet"
            />
        </section>
        <article class = "noFreets"
            v-else
        >
            <h3>No freets posted yet!</h3>
        </article>
    </main>
</template>
  
<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import ProfileInfo from '@/components/Profile/ProfileInfo.vue';
import ShareTimeInfo from '@/components/Profile/ShareTime.vue';

export default {
    name: 'ProfilePage',
    components: {
        FreetComponent,
        ProfileInfo,
        ShareTimeInfo,
    },
    data() {
        console.log("Meow");
        return {
            user : this.$route.params.username,
        }
    },
    mounted() {
        this.$refs.ProfInfo.submit();
        this.$refs.ProfInfo.ben();
        this.$refs.ProfTime.submit();
        
    },
    computed : {
        myFreets () {
            return this.$store.getters.userFreets(this.user);
        }
    },
};
</script>

<style scoped>

.intro {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20px;
    position: relative;
}

.profileInfo{
    display: flex;
    position: relative;
    flex-grow: 4;
}

.noFreets{
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

</style>