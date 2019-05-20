export default class {
  constructor (data) {
    this.name = data.name || data.id
    this.description = data.description

    if (data.isParty)
      this.isParty = true
    else
      this.data = { race: undefined, age: undefined }
    // We always want these

    if (data.data) {
      for (const [key, value] of Object.entries(data.data)) {
        this.data[key] = value
      }
    }

    if (data.isParty) {
      this.isParty = true
      delete this.race
      delete this.age
    }
  }
}
