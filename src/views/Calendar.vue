<template>
  <div id="calendar">
    <h1>Calendar</h1>
    <div v-for="(year, y) in cal.years" :key="y">
      <h2>{{ year.year }}</h2>

      <MonthComponent v-for="(month, m) in year.months" class="month" :key="m"
        :month="month" :m="m" :monthName="month.name || cal.standardMonthNames[m]"
        :year="year" :y="y"/>
    </div>
    <button class="btn btn-primary" type="button" v-on:click="addMonth()">Add month</button>
  </div>
</template>

<script>
import MonthComponent from '@/components/MonthComponent.vue'
import { Calendar, Year /*, Month, Week, Day */ } from '@/classes/Calendar.js'
let sample_calendar = require('@/assets/sample_calendar.json')

export default {
  name: 'calendar',
  components: {
    MonthComponent
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
    }()),
    addMonth: function () {
      let cal = this.cal
      for (let y = 0; y < cal.years.length; y++) {
        let year = cal.years[y]

        for (let m = 0; m < year.months.length; m++) {
          let month = year.months[m]
          if (!month.isDrawn) {
            month = Object.assign({}, month, { isDrawn: true }) // required for dynamic state tracking of that month
            year.months.splice(m, 1, month) // required for dynamic updating of vue list
            return
          }
        }
        cal.years.push(new Year({ year: '2020' }, cal.standardMonths, cal.standardWeeks, cal.standardDays))
      }
    }
  },

  data: function () {
    return { cal: Calendar }
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

      p { margin: 0 }
  }
}
</style>
