<!-- Page for user's profile-->
<!-- User should be authenticated in order to see this page -->

<template>
    <article class = EditProfile>
        <div>
            <button
            v-if="editing"
            @click="submitEdit"
            >
            ☑️ Save changes
            </button>
            <button
            v-if="editing"
            @click="stopEditing"
            >
            🚫 Discard changes
            </button>
            <button
            v-if="!editing"
            @click="startEditing"
            >
            ✏️ Edit
            </button>
        </div>
        <textarea
            v-if="editing"
            class="content"
            :value="draft"
            @input="draft = $event.target.value"
        />
        <h2 
            v-else-if = "(which === 'displayName') && benevolence === 'true'"
            class = "displayName"
        > 
                {{content}}
                <div>
                    ✅
                </div>
        </h2>
        <h2 
            v-else-if = "(which === 'description')"
            class = "content"
        > 
                Description: {{content}}
        </h2>
        <h2 
            v-else-if = "(which === 'birthday')"
            class = "content"
        > 
                Birthday: {{content}}
        </h2>
        <h2 
            v-else
            class = "content"
        > 
                {{content}}
        </h2>
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
    name: 'ProfileEdit',
    props: ['content', 'which', 'benevolence'],
    data() {
        return {
            editing: false,
            draft: '',
            alerts: {},
        }
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draft = this.content; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draft = this.content;
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            if (this.content === this.draft) {
                const error = 'Error: Edited freet content should be different than current freet content.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            let contentType = {};
            contentType[this.which] = this.draft;
            console.log(contentType);

            const params = {
                method: 'PUT',
                message: `Successfully edited profile!`,
                body: JSON.stringify(contentType),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            console.log("These are the params", params);
            this.request(params);
        },
        async request(params) {
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
                const r = await fetch(`/api/profile/`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.editing = false;
                this.content = this.draft;
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>

<style scoped>
.displayName{
    display: flex;
    position: relative;
    flex-direction: row;
    flex-grow: start;
}

</style>