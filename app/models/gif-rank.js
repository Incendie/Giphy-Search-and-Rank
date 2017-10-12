import DS from "ember-data";

export default DS.Model.extend({
  gifID: DS.attr(),
  votes: DS.attr("number")
  // users: DS.attr()
});
