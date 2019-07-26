import Helper, { states } from "./_helper";

describe("Integration | ORM | Has Many | One-Way Reflexive | association #setIds", () => {
  beforeEach(() =>  {
    this.helper = new Helper();
  });

  states.forEach(state => {
    test(`a ${state} can update its association to include a saved child via childIds`, () => {
      let [tag] = this.helper[state]();
      let savedTag = this.helper.savedChild();

      tag.tagIds = [savedTag.id];

      expect(tag.tags.models[0].attrs).toEqual(savedTag.attrs);
      expect(tag.tagIds).toEqual([savedTag.id]);

      tag.save();
      savedTag.reload();

      expect(savedTag.tags.models.length).toEqual(0);
    });

    test(`a ${state} can clear its association via a null childIds`, () => {
      let [tag] = this.helper[state]();

      tag.tagIds = null;

      expect(tag.tags.models).toEqual([]);
      expect(tag.tagIds).toEqual([]);

      tag.save();
    });
  });
});
