export default class Person {
  color = ''
  isParty = false
  isPerson = true
  name = ''
  data = { race: undefined, age: undefined } // We always want these

  constructor (data) {
    this.id = data.id || data.name
    this.name = data.name || data.id // TODO: ID from database, name to separate field
    this.plotImportance = data.plotImportance || data.size
    this.description = data.description
    this.inParty = data.inParty;
    this.x = data.x
    this.y = data.y
    this.group = data.faction || data.group

    if (data.isParty) {
      this.isParty = true
      this.data = null
    }

    if (data.data) {
      for (const [key, value] of Object.entries(data.data)) {
        this.data[key] = value
      }
    }

    this.color = data.color || "#E84B3C"

    // if (data.isParty) {
    //   this.isParty = true
    //   delete this.race
    //   delete this.age
    // }
  }
}
