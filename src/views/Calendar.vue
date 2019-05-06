<template>
  <div id="calendar">
    <h1>Calendar</h1>
    <div v-for="(year, y) in cal.years" :key="y">
      <h2>{{ year.year }}</h2>
      <div v-for="(month, m) in year.months" class="month" :key="m">
        <div v-if="month.isDrawn">
          <h3>{{ month.name || cal.standardMonthNames[m] }}</h3>

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
      </div>
    </div>
    <button class="btn btn-primary" type="button" v-on:click="addMonth()">Add month</button>
  </div>
</template>

<script>
import DayComponent from '@/components/DayComponent.vue'
import { Calendar, Year, Month, Week, Day } from '@/classes/Calendar.js'
let sample_calendar = require('@/assets/sample_calendar.json')

export default {
  name: 'calendar',
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
    }()),
    addMonth: function () {

      for (let y = 0; y < this.cal.years.length; y++) {
        let year = this.cal.years[y]

        for (let m = 0; m < year.months.length; m++) {
          let month = year.months[m]
          if (!month.isDrawn) {
            month = Object.assign({}, month, { isDrawn: true }) // required for dynamic state tracking of that month
            year.months.splice(m, 1, month) // required for dynamic updating of vue list
            return
          }
        }


        // this.cal.years.push(new Year('f'))

      }
    }
  },

  data: function () {
    return { cal: Calendar}
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

      p { margin: 0 }
  }
}
</style>
