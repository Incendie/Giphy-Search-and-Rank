import Ember from "ember";

export default Ember.Route.extend({
  model(params) {
    return Ember.$.getJSON("http://api.giphy.com/v1/gifs/search", {
      api_key: "n0sOp14xAIkQFZAa5AAZNKYyKGopgPzf",
      q: `${params.results}`,
      offset: "0"
    });
  }
});
