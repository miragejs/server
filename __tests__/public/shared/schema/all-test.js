import { Server, Model, Collection } from "@miragejs/server";

describe("Public | Shared | Schema | #all", function() {
  test("it can return all models", () => {
    let User = Model.extend();

    let server = new Server({
      environment: "test",
      models: {
        user: User
      },
      fixtures: {
        users: [{ id: 1, name: "Link" }, { id: 2, name: "Zelda" }]
      }
    });

    let users = server.schema.users.all();

    expect(users instanceof Collection).toBeTruthy();
    expect(users.models[0] instanceof User).toBeTruthy();
    expect(users.models).toHaveLength(2);
    expect(users.models[1].attrs).toEqual({ id: "2", name: "Zelda" });
  });

  // test("it returns an empty array when no models exist", () => {
  //   let db = new Db({ users: [] });
  //
  //   let User = Model.extend();
  //   let schema = new Schema(db, {
  //     user: User
  //   });
  //
  //   let users = schema.users.all();
  //
  //   expect(users instanceof Collection).toBeTruthy();
  //   expect(users.modelName).toEqual("user");
  //   expect(users.models).toHaveLength(0);
  // });
});
