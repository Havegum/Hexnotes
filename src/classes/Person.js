export default class {
  color = ''
  isParty = false
  isPerson = true
  name = ''
  data = { race: undefined, age: undefined } // We always want these

  constructor (data) {
    this.id = data.id || data.name
    this.size = data.size
    this.name = data.name || data.id // TODO: ID from database, name to separate field
    this.description = data.description
    this.inParty = data.inParty;
    this.x = data.x
    this.y = data.y

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
