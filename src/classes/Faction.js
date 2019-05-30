export default class Faction {
  name
  id
  color
  members
  isFaction = true

  constructor (data) {
    this.name = data.name;
    this.id = data.id;
    this.color = data.color;
    this.members = data.members;
  }
}
