<!-- Article to vote/report user-->
<!-- User should be authenticated in order to see this page -->

<template>
    <section>
        <div>
            <button
            class = "submit"
            v-if="editing"
            @click="NominateUser"
            >
            ✅ Nominate
            </button>
            <button
            class = "submit"
            v-if="editing"
            @click="ReportUser"
            >
            🚫 Report
            </button>
            <button
            v-if="editing"
            @click="stopEditing"
            >
            Cancel
            </button>
            <button
            v-if="!editing"
            @click="startEditing"
            >
            Benevolence
            </button>
        </div>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
        <div 
            class = "popUp"
            v-if = "showPopUp"
        >
            <header>
                <h1>
                    We are sorry if @{{user}} harmed you in any way
                </h1>
                <p>
                    Here at Fritter, our goal is to create a positive environment for all users 
                    by making sure people show a respect for each other. Your feedback
                    has been received and is valued.
                </p>
                <button
                    @click="moveOn"
                >
                    Understood
                </button>
            </header>
            
        </div>
    </section>
</template>
  
<script>

export default {
    name: 'BenevolenceVote',
    props: ['user'],
    data() {
        return {
            editing: false,
            draft: '',
            alerts: {},
            showPopUp: false,
        }
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
        },
        moveOn(){
            this.showPopUp = false;
            this.$router.push({name: 'Home'});
        },
        ReportUser(){
            const params = {
                method: 'PUT',
                message: `Successfully reported ${this.user}`,
                body: JSON.stringify({user: this.user}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    this.showPopUp = true;
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request('report', params);
        },
        NominateUser(){
            this.editing = false;
            const params = {
                method: 'PUT',
                message: `Successfully nominated ${this.user}`,
                body: JSON.stringify({user: this.user}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request('nominate',params);
        },
        async request(choice, params) {
            /**
             * Submits a request to the freet's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/benevolence/${choice}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                params.callback();
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
.popUp{
    display: flex;
    position: absolute;
    background-color: antiquewhite;
    opacity: 100%;
    flex-grow: 5;
    top: 40px;
    right: 0px;
    width: 600px;
    height: 600px;
    border: 3px solid #73AD21;
    font-size: 30px;
}
</style>