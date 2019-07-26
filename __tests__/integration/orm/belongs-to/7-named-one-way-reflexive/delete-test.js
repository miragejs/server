import Helper, { states } from "./_helper";

describe("Integration | ORM | Belongs To | Named One-Way Reflexive | delete", () => {
  beforeEach(() =>  {
    this.helper = new Helper();
  });

  states.forEach(state => {
    test(`deleting the parent updates the child's foreign key for a ${state}`, () => {
      let [user, parent] = this.helper[state]();

      if (parent) {
        parent.destroy();
        user.reload();
      }

      expect(user.parentId).toEqual(null);
      expect(user.parent).toEqual(null);
    });
  });
});
