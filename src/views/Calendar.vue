<template>
  <div id="calendar">
    <h1>Calendar</h1>
    <div v-for="(month, m) in cal.years[0].months" class="month">
      <h2>{{( month ? month.name : cal.standard_month_names[m] || 'Month ' + (m+1) )}}</h2>
      <div v-for="(week, w) in month ? month.weeks : cal.standard_weeks" class="week">
        <div class="week-num label">
          <p v-if="week && week.name">{{ week.name }}</p>
          <p v-else>{{ w+1 + m*(month ? month.weeks.length : cal.standard_weeks) }}</p>
        </div>
        <div v-for="(day, d) in month && week ? week.days : cal.standard_days" class="day">
          <p class="label">{{ d+1 + w*(week && week.days ? week.days.length : cal.standard_days) }}</p>
          <div v-if="day">
            <p v-for="happening in day.happenings" class="bg-primary text-light pill">{{ happening.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/classes/Calendar.js'
let sample_calendar = require('@/assets/sample_calendar.json')

export default {
  data: function () {
    return {
    }
  },
  beforeMount: function () {
    this.cal = new Calendar(sample_calendar)
    console.log(this.cal);
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
  .day {
    border-right: 1px solid lightgrey;
    text-align: left;
    flex-basis: 2em;
    flex-grow: 10;
    min-height: 3em;

    &:hover {
      background-color: lightgray;
    }
    p {
      line-height: 1em;
      margin-bottom: .5em;
    }
  }
}
</style>
