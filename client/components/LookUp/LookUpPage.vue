<!-- Form for getting freets (all, from user) (inline style) -->
<template>
    <main>
        <header>
            <h1>
                Search up any user
            </h1>
        </header>
        <LookUpBar
            class = "lookup"
            placeholder="Enter Username to Look Up"
            button="Find Profile"
        >
        </LookUpBar>
        <QuickLinks ref = "getLinks"
            :showReports = false
        >
            
        </QuickLinks>
    </main>
    
</template>

<script>
import LookUpBar from '@/components/LookUp/LookUpBar.vue';
import QuickLinks from '@/components/Benevolence/QuickLinks.vue';

export default {
  name: 'LookUpPage',
  components: {
    LookUpBar,
    QuickLinks,
  },
  mounted() {
    this.$refs.getLinks.submit(); 
  },
};
</script>

<style scoped>
.lookup{
    display: flex;
    flex-grow: 5;
    width : 100%;
    padding-bottom: 20px;
}
</style>