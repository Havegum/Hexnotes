<template>
  <aside>
    <p>This is the future, there's a toolbar here</p>
    <p>Let's check that we're sharing a state ... This number should be equal to the one in the header under "Network" – Counter: {{ count }}</p>
    <p>{{ data }}</p>
  </aside>
</template>

<script>
export default {
  computed: {
    count () {
      return this.$store.state.count || 0;
    },

    data () {
      return this.$store.state.data || '{{ empty so far .. }}';
    }
  }
};
</script>

<style>

</style>
