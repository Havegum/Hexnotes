class Happening {
  text = 'Festival of the sea'
  color = 'lightblue'

  constructor (options) {
    this.text = options.text
    this.color = options.color
  }
}

class Day {
  name = undefined
  happenings = []

  constructor (options) {
    if (options.happenings) {
      this.happenings = options.happenings.map(h => new Happening(h))
    }
    this.name = options.name
  }
}

class Week {
  name = undefined
  days = []

  constructor (options) {
    this.days.lenght = options.day_count
    for (let i = 0; options.days && i < options.days.length; i++) {
      this.days[i] = new Day(options.days[i])
    }
    this.name = options.name
  }
}

class Month {
  name = undefined
  weeks = []

  constructor (options) {
    this.weeks.length = options.week_count
    for (var i = 0; i < options.weeks.length; i++) {
      this.weeks[i] = new Week(options.weeks[i])
    }
    this.name = options.month
  }
}

class Year {
  year = 1
  // TODO: Should probably be a string
  //       People might want the format: "n-th of *something*"
  months = []

  constructor (options) {
    this.months.length = options.month_count
    for (var i = 0; i < options.months.length; i++) {
      this.months[i] = new Month(options.months[i])
    }
    this.year = options.year
  }
}

export default class Calendar {
  years = []

  standard_months = 12
  standard_month_names = []

  standard_weeks = 4
  standard_weeks_names = []

  standard_days = 7
  standard_days_names = []

  constructor (options) {
    this.years = options.years.map(y => new Year(y))
    this.standard_month_names = options.month_names
    this.standard_day_names = options.day_names
  }
}
