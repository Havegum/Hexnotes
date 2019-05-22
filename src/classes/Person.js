export default class {
  color = ''
  isParty = false
  name = ''
  data = { race: undefined, age: undefined }// We always want these

  constructor (data) {
    this.name = data.name || data.id
    this.description = data.description

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

    if (data.isParty) {
      this.isParty = true
      delete this.race
      delete this.age
    }
  }
}
