import Helper, { states } from "./_helper";

describe("Public | Shared | Schema | Belongs To | One-Way Reflexive | delete", () => {
  let helper;
  beforeEach(() => {
    helper = new Helper();
  });
  afterEach(() => {
    helper.shutdown();
  });

  states.forEach(state => {
    test(`deleting the parent updates the child's foreign key for a ${state}`, () => {
      let [user, targetUser] = helper[state]();

      if (targetUser) {
        targetUser.destroy();
        user.reload();
      }

      expect(user.userId).toBeNil();
      expect(user.user).toBeNil();
    });
  });
});
