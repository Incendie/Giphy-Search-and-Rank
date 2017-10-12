import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    gifUpvote(giphyID) {
      let fb = this.store.findAll("gif-rank", "votes");
      let fbID = [];
      fb.then(res => {
        res.content.forEach((entry, id) => {
          fbID.push(entry.id);
          let gifVotes = entry._data.votes;
          let gifID = entry._data.gifID;
        });
        fbID.forEach(idNum => {
          this.store.findRecord("gif-rank", idNum).then(record => {
            if (record.id === giphyID) {
              record.data.votes++;
              record.save();
            }
          });
        });
      });
      // console.log(fbGif);
      // const sendFB = this.store.createRecord("gif-rank", {
      //   gifID: "123",
      //   votes: "1"
      // });
      // sendFB.save();
    },
    gifDownvote(giphyID) {}
  },

  model(params) {
    return Ember.$.getJSON("http://api.giphy.com/v1/gifs/search", {
      api_key: "n0sOp14xAIkQFZAa5AAZNKYyKGopgPzf",
      q: `${params.results}`,
      offset: "0"
    });
  },
  afterModel(promise) {
    let fb = this.store.findAll("gif-rank", "votes");
    let fbID = [];
    let promiseID = [];
    promise.data.forEach(data => {
      promiseID.push(data.id);
    });

    fb.then(res => {
      res.content.forEach((entry, id) => {
        fbID.push(entry.id);
      });

      //create new firebase entries if don't exist
      if (fbID.length === 0) {
        promiseID.forEach(giphyID => {
          const sendFB = this.store.createRecord("gif-rank", {
            gifID: giphyID,
            votes: 0
          });
          sendFB.save();
        });
      } else {
        fbID.forEach(idNum => {
          this.store
            .findRecord("gif-rank", idNum)
            .then(record => {
              let indexToDelete = promiseID.indexOf(record.data.gifID);
              if (indexToDelete > -1) {
                promiseID.splice(indexToDelete, 1);
              }
            })
            .then(() => {
              if (promiseID.length > 0) {
                promiseID.forEach((giphyID, loc) => {
                  let sendFB = this.store.createRecord("gif-rank", {
                    gifID: giphyID,
                    votes: 0
                  });
                  promiseID.splice(loc, 1);
                  sendFB.save();
                });
              }
            });
        });
      }
    });
  }
});
