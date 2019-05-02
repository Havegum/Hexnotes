class Happening {
  text = 'Festival of the sea'
  color = 'lightblue'

  constructor (options) {
    this.text = options.text
    this.color = options.color
  }
}

class Day {
  // name = undefined
  // happenings = []

  constructor (options) {
    if(options) {
      if (options.happenings) {
        this.happenings = options.happenings.map(h => new Happening(h))
      }
      this.name = options.name
    }
  }
}

class Week {
  // name = undefined
  // days = []

  constructor (options, stdD) {
    this.days = Array(options ? options.day_count || stdD : stdD)
    for (let i = 0; i < this.days.length; i++) {
      this.days[i] = new Day(options && options.days ? options.days[i] || null : null)
    }
    if(options) this.name = options.name
  }
}

class Month {
  // name = undefined
  // weeks = []

  constructor (options, stdW, stdD) {
    this.weeks = Array(options ? options.week_count || stdW : stdW)
    for (let i = 0; i < this.weeks.length; i++) {
      this.weeks[i] = new Week(options && options.weeks ? options.weeks[i] || null : null, stdD)
    }
    if(options) this.name = options.month
  }
}

class Year {
  // year = 1
  // TODO: Should probably be a string
  //       People might want the format: "n-th of *something*"

  // months = []

  constructor (options, stdM, stdW, stdD) {
    this.months = Array(options ? options.month_count || stdM : stdM)
    for (let i = 0; i < this.months.length; i++) {
      this.months[i] = new Month(options.months[i], stdW, stdD)
    }
    if(options) this.year = options.year
  }
}

export default class Calendar {
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
    //this.years = options.years.map(y => new Year(y, this.standardMonths, this.standardWeeks, this.standardDays))
  }
}
