<template>
  <div id="calendar">
    <h1>Calendar</h1>
    <div v-for="(month, m) in cal.years[0].months" class="month" :key="m">
      <h2>{{ month.name || cal.standardMonthNames[m] }}</h2>

      <div v-for="(week, w) in month.weeks" class="week" :key="w">
        <div class="week-num label">
          <p v-if="week && week.name">{{ week.name }}</p>
          <p v-else>{{ w+1 + m*(month ? month.weeks.length : cal.standardWeeks) }}</p>
        </div>

        <Day v-for="(day, d) in week.days /*month && week && week.days ? week.days : cal.standardDays*/"
          :key="d"
          :d="d"
          :day="day"
          :dotm="getDay(w+d)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Day from '@/components/Day.vue'
import Calendar from '@/classes/Calendar.js'
let sample_calendar = require('@/assets/sample_calendar.json')

export default {
  name: 'calendar',
  components: {
    Day
  },
  methods: {
    getDay: (function () {
      let i = 1
      return n => {
        if (n === 0) i = 1
        return i++
      }
    }())
  },

  data: function () {
    return {}
  },

  beforeMount: function () {
    this.cal = new Calendar(sample_calendar)
    console.log(this.cal)
  }
}
</script>

<style lang='scss'>
#calendar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.month {
  max-width: calc(35em + 20vw);
  margin: 1.5em auto 0;

  h2 {
    text-align: left;
  }
}

.week {
  display: flex;
  flex-direction: row;
  position: relative;
  border-bottom: 1px solid #444;

  &:first-of-type {
    border-top: 1px solid lightgrey;
  }

  p {
    font-size: .8em;
    margin: .2em;
  }
  .pill {
    border-radius: 6px;
    padding: 2px 3px;
  }
  .label { user-select: none; color: var(--gray) }
  .week-num {
      padding-top: 0;
      flex-basis: 1em;
      color: var(--white);
      background-color: var(--info);
      writing-mode: sideways;
      text-orientation: sideways;
      flex-grow: 1;
  }
}
</style>
