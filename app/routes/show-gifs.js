import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    submitSearch(searchValue) {
      this.transitionTo("show-gifs.search", searchValue);
    }
  }
});
