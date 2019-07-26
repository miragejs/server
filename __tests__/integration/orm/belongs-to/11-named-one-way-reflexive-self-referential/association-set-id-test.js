import Helper from "./_helper";

describe("Integration | ORM | Belongs To | Named one-way reflexive self referential | association #setId", () => {
  beforeEach(() =>  {
    this.helper = new Helper();
  });

  /*
    The model can update its association via parentId, for all states
  */

  ["savedChildNoParent", "savedChildSavedParent"].forEach(state => {
    test(`a ${state} can update its association to itself via parentId`, () => {
      let [user] = this.helper[state]();

      user.representativeId = user.id;

      expect(user.representativeId).toEqual(user.id);
      expect(user.representative.attrs).toEqual(user.attrs);

      user.save();

      expect(user.representativeId).toEqual(user.id);
      expect(user.representative.attrs).toEqual(user.attrs);
    });
  });

  ["savedChildSavedParent", "newChildNewParent"].forEach(state => {
    test(`a ${state} can clear its association via a null parentId`, () => {
      let [user] = this.helper[state]();

      user.representativeId = null;

      expect(user.representativeId).toEqual(null);
      expect(user.representative).toEqual(null);

      user.save();

      expect(user.representativeId).toEqual(null);
      expect(user.representative).toEqual(null);
    });
  });
});
