<template>
  <div v-if="month.isDrawn">
    <h3>{{ monthName }}</h3>

    <div v-for="(week, w) in month.weeks" class="week" :key="w">
      <div class="week-num label">
        <p v-if="week.name">{{ week.name }}</p>
        <p v-else>{{ getWeek(y, week) }}</p>
      </div>

      <DayComponent v-for="(day, d) in week.days"
        :key="d"
        :d="d"
        :day="day"
        :dotm="getDay(w+d)"
      />
    </div>
  </div>
</template>

<script>
import DayComponent from '@/components/DayComponent.vue'

export default {
  name: 'monthcomponent',
  props: ['month', 'm', 'monthName', 'year', 'y'],

  components: {
    DayComponent
  },

  methods: {
    getDay: (function () {
      let i = 1
      return n => {
        if (n === 0) i = 1
        return i++
      }
    }()),
    getWeek: (function () {
      let i = 1
      let currentYear = 0
      return (y, week) => {
        if (y !== currentYear) {
          currentYear = y
          i = 1
        }
        week.name = i
        return i++
      }
    }())
  }
}
</script>

<style lang="scss">

.month {
  max-width: calc(35em + 20vw);
  margin: 1.5em auto 0;

  h3 {
    text-align: left;
  }
}
</style>
