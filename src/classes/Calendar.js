class Happening {
  // text = 'Festival of the sea'
  // color = 'lightblue'

  constructor (options) {
    this.text = options.text
    this.color = options.color
  }
}

class Day {
  constructor (options) {
    if (options) {
      if (options.happenings) {
        this.happenings = options.happenings.map(h => new Happening(h))
      }
      this.name = options.name
    }
  }
}

class Week {
  constructor (options, stdD) {
    if (options) {
      this.days = Array(options.day_count || stdD)
      for (let i = 0; i < this.days.length; i++) {
        this.days[i] = new Day(options.days ? options.days[i] || null : null)
      }
      this.name = options.name
    } else {
      this.days = Array(stdD)
      for (let i = 0; i < this.days.length; i++) {
        this.days[i] = new Day(null)
      }
    }
  }
}

class Month {
  constructor (options, stdW, stdD) {
    if (options) {
      this.weeks = Array(options.week_count || stdW)
      for (let i = 0; i < this.weeks.length; i++) {
        this.weeks[i] = new Week(options.weeks ? options.weeks[i] || null : null, stdD)
      }
      this.name = options.month
      this.isDrawn = true
    } else {
      this.weeks = Array(stdW)
      for (let i = 0; i < this.weeks.length; i++) {
        this.weeks[i] = new Week(null, stdD)
      }
    }
  }
}

class Year {
  constructor (options, stdM, stdW, stdD) {
    if (options) {
      this.months = Array(options.month_count || stdM)
      for (let i = 0; i < this.months.length; i++) {
        this.months[i] = new Month(options.months ? options.months[i] : null || null, stdW, stdD)
      }
      this.year = options.year
    } else {
      this.months = Array(stdM)
      for (let i = 0; i < this.months.length; i++) {
        this.months[i] = new Month(null, stdW, stdD)
      }
    }
  }
}

class Calendar {
  years = []

  standardMonths = 12
  standardMonthNames = []

  standardWeeks = 4
  standardWeeksNames = []

  standardDays = 7
  standardDaysNames = []

  constructor (options) {
    this.standardMonthNames = options.month_names
    this.standardDayNames = options.day_names

    this.years = options.years.map(y => new Year(y, this.standardMonths, this.standardWeeks, this.standardDays))
  }
}

export {
  Calendar,
  Year,
  Month,
  Week,
  Day
}
