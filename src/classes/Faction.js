export default class Faction {
  name
  id
  color
  members
  isFaction = true
  description

  constructor (data) {
    this.name = data.name;
    this.id = data.id;
    this.color = data.color;
    this.members = data.members;
    this.description = data.description;
  }
}
