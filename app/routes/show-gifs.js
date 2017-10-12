import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    submitSearch(searchValue) {
      const sendFB = this.store.createRecord("gif-rank", {
        gifID: "123",
        votes: "1"
      });
      sendFB.save();
      this.transitionTo("show-gifs.search", searchValue);
    }
  }
});
