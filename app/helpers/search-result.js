import Ember from "ember";

export function searchResult(params /*, hash*/) {
  return params[0].data;
}

export default Ember.Helper.helper(searchResult);
