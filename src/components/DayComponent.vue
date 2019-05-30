<template>
  <div class="day">
    <p class="label">{{ dotm }}</p>

    <div v-if="day.happenings" >
      <div v-for="happening in day.happenings" v-bind:key="happening.text">
        <p class="bg-primary text-light pill" v-bind:style="{ backgroundColor: happening.color + ' !important' }">{{ happening.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'daycomponent',
  props: ['day', 'd', 'dotm']
};
</script>

<style lang="scss">
.day {
  border-right: 1px solid lightgrey;
  text-align: left;
  flex-basis: 2em;
  flex-grow: 10;
  min-height: 3em;
  transition: background-color 150ms ease-out;

  &:hover {
    background-color: #f0f0f0;
    transition: none;
  }
  p {
    line-height: 1em;
    margin-bottom: .5em;
  }
}
</style>
