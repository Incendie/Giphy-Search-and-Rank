import Ember from "ember";
let firebaseIDs = [];

export default Ember.Route.extend({
  actions: {
    gifUpvote(giphyID) {
      let fb = this.store.findAll("gif-rank");
      let fbID = [];
      let gifData = [];

      //setup comparison arrays
      fb.then(res => {
        res.content.forEach((entry, id) => {
          fbID.push(entry.id);
          gifData.push(entry._data);
        });

        //increment vote by 1 in firebase
        fbID.forEach(idNum => {
          this.store.findRecord("gif-rank", idNum).then(record => {
            if (record.data.gifID === giphyID) {
              let numVotes = record.data.votes;
              numVotes++;
              record.data.votes++;
              $(`#${record.data.gifID}`).css("order", -record.data.votes);
              $(`#${record.data.gifID} .numVotes`).text(record.data.votes);
              record.set("votes", numVotes);
              record.save();
            }
          });
        });
      });
    },

    gifDownvote(giphyID) {
      let fb = this.store.findAll("gif-rank", "votes");
      let fbID = [];
      let gifData = [];

      //setup comparison arrays
      fb.then(res => {
        res.content.forEach((entry, id) => {
          fbID.push(entry.id);
          gifData.push(entry._data);
        });

        //decrement vote by 1 in firebase
        fbID.forEach(idNum => {
          this.store.findRecord("gif-rank", idNum).then(record => {
            if (record.data.gifID === giphyID) {
              let numVotes = record.data.votes;
              if (numVotes > 0) {
                numVotes--;
                record.data.votes--;
                $(`#${record.data.gifID}`).css("order", -record.data.votes);
                $(`#${record.data.gifID} .numVotes`).text(record.data.votes);
                record.set("votes", numVotes);
                record.save();
              }
            }
          });
        });
      });
    }
  },
  model(params) {
    return Ember.$.getJSON("http://api.giphy.com/v1/gifs/search", {
      api_key: "n0sOp14xAIkQFZAa5AAZNKYyKGopgPzf",
      q: `${params.results}`,
      offset: "0",
      rating: "g"
    });
  },

  afterModel(promise) {
    let fb = this.store.findAll("gif-rank", "votes");
    let fbID = [];
    let gifData = [];
    let promiseID = [];

    //setup comparison arrays
    promise.data.forEach(data => {
      promiseID.push(data.id);
    });

    fb.then(res => {
      res.content.forEach(entry => {
        fbID.push(entry.id);
        gifData.push(entry._data);
      });

      //sort gifs in order to be viewed
      gifData.sort((a, b) => {
        return b.votes - a.votes;
      });

      for (let i = 0; i < gifData.length; i++) {
        $(`#${gifData[i].gifID}`).css("order", -gifData[i].votes);
        $(`#${gifData[i].gifID} .numVotes`).text(gifData[i].votes);
      }

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
