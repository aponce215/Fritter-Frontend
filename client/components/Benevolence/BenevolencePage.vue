<!-- Form for getting freets (all, from user) (inline style) -->
<template>
    <main>
        <header>
            <h1>
                Benevolence
            </h1>
        </header>
        <QuickLinks
            ref = "getLinks"
            :showReports = true
        >    
        </QuickLinks>
        
    </main>
    
</template>

<script>

import QuickLinks from '@/components/Benevolence/QuickLinks.vue';

export default {
  name: 'BenevolencePage',
  components: {
    QuickLinks,
  },
  mounted() {
    this.$refs.getLinks.submit(); 
  },
};
</script>

<style scoped>
</style>