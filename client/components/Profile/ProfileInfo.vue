<!-- Page for user's profile-->
<!-- User should be authenticated in order to see this page -->

<template>
    <article class = info>
        <section class = "Names">
            <!-- Profile Data-->
            <header>
                <ProfileEdit
                    v-if = "$store.state.username === user"
                    which = 'displayName'
                    :content = 'displayName'
                    :benevolence = 'benevolence'
                />
                <h2 
                    v-else
                    class = "displayName"
                > 
                    {{displayName}} 
                    <div v-if = "benevolence === 'true'">
                        ✅
                    </div>
                </h2>
                <h3 class = "username">@{{user}}</h3>
            </header>
            <BenevolenceVote 
                v-if = "$store.state.username !== user"
                :user = 'user'
            >
            </BenevolenceVote>
        </section>
        <section class = "description">
            <ProfileEdit
                v-if = "$store.state.username === user"
                which = 'description'
                :content = 'description'
            />
            <header 
                v-else
                class = "descInfo"
            >
                <h2> Description: {{description}} </h2>
            </header>
            <ProfileEdit
                v-if = "$store.state.username === user"
                which = 'birthday'
                :content = 'birthday'
            />
            <header 
                v-else
                class = "birthday"
            >
                <h2> Birthday: {{birthday}} </h2>
            </header>
        </section>
    </article>
</template>
  
<script>

import ProfileEdit from '@/components/Profile/ProfileEdit.vue';
import BenevolenceVote from '@/components/Profile/BenevolenceVote.vue';

export default {
    name: 'ProfileInfo',
    components: {
        ProfileEdit,
        BenevolenceVote
    },
    data() {
        return {
            user : this.$route.params.username,
            displayName: '',
            birthday: '',
            description: '',
            benevolence: 'false',
        }
    },
    methods: {
        async submit(){
            console.log("Submitting")
            const url = this.user ? `/api/profile?author=${this.user}` : '/api/profile/myProfile';
            console.log("This is url", url);
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                console.log(res);
                this.user = res.author;
                this.displayName = res.displayName;
                this.birthday = res.birthday;
                this.description = res.description
            } 
            catch (e) {
                console.log("Wth");
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async ben(){
            const url = this.user ? `/api/benevolence?author=${this.user}` : '/api/profile/myProfile';
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                console.log(res);
                this.benevolence = res.granted;
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

.Names {
    display: flex;
    padding-bottom: 25px;
    flex-direction: row;
    justify-content: space-between;
}

.displayName{
    display: flex;
    flex-direction: row;
    justify-content: start;
}
.info {
    display: flex;
    flex-direction: column;
    /* margin-top: 25px; */
    border: 1px solid #111;
    padding: 20px;
}

.description {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.username{
    color: #585858;
}

</style>