<template>
  <div class="day">
    <p class="label">{{ dotm /*+ w*(week && week.days ? week.days.length : cal.standard_days) */}}</p>
    <p>{{ day }}</p>
    <!--
    <div v-if="day && day.happenings">
      <div v-for="happening in day.happenings">
        <p class="bg-primary text-light pill" v-bind:style="{ backgroundColor: happening.color+'  !important' }">{{ happening.text }}</p>
      </div>
    </div>
  -->
  </div>
</template>

<script>
export default {
  name:'day',
  props: ['day', 'd', 'dotm']
}
</script>

<style lang="css">
</style>
