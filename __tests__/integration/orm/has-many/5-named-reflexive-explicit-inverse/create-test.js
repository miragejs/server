import Helper from "./_helper";
import { Model } from "@miragejs/server";

describe("Integration | ORM | Has Many | Named Reflexive Explicit Inverse | create", function(hooks) {
  hooks.beforeEach(function() {
    this.helper = new Helper();
    this.helper.schema.registerModel("foo", Model);
  });

  test("it sets up associations correctly when passing in the foreign key", assert => {
    let { schema } = this.helper;
    let tagA = schema.tags.create();
    let tagB = schema.tags.create({
      labelIds: [tagA.id]
    });

    tagA.reload();

    expect(tagA.labelIds).toEqual([tagB.id]);
    expect(tagB.labelIds).toEqual([tagA.id]);
    expect(tagA.attrs.labelIds).toEqual([tagB.id]);
    expect(tagB.attrs.labelIds).toEqual([tagA.id]);
    expect(tagA.labels.models[0].attrs).toEqual(tagB.attrs);
    expect(tagB.labels.models[0].attrs).toEqual(tagA.attrs);
    expect(this.helper.db.tags.length).toEqual(2);
    expect(this.helper.db.tags[0]).toEqual({ id: "1", labelIds: ["2"] });
    expect(this.helper.db.tags[1]).toEqual({ id: "2", labelIds: ["1"] });
  });

  test("it sets up associations correctly when passing in an array of models", assert => {
    let { schema } = this.helper;
    let tagA = schema.tags.create();
    let tagB = schema.tags.create({
      labels: [tagA]
    });

    tagA.reload();

    expect(tagB.labelIds).toEqual([tagA.id]);
    expect(tagA.labelIds).toEqual([tagB.id]);
    expect(tagA.attrs.labelIds).toEqual([tagB.id]);
    expect(tagB.attrs.labelIds).toEqual([tagA.id]);
    expect(this.helper.db.tags.length).toEqual(2);
  });

  test("it sets up associations correctly when passing in a collection", assert => {
    let { schema } = this.helper;
    let tagA = schema.tags.create();
    let tagB = schema.tags.create({
      labels: schema.tags.all()
    });

    tagA.reload();

    expect(tagB.labelIds).toEqual([tagA.id]);
    expect(tagA.labelIds).toEqual([tagB.id]);
    expect(tagB.attrs.labelIds).toEqual([tagA.id]);
    expect(tagA.attrs.labelIds).toEqual([tagB.id]);
    expect(this.helper.db.tags.length).toEqual(2);
  });

  test("it throws an error if a model is passed in without a defined relationship", assert => {
    let { schema } = this.helper;

    expect(function() {
      schema.tags.create({
        foo: schema.create("foo")
      });
    }).toThrow();
  });

  test("it throws an error if an array of models is passed in without a defined relationship", assert => {
    let { schema } = this.helper;

    expect(function() {
      schema.tags.create({
        foos: [schema.create("foo")]
      });
    }).toThrow();
  });

  test("it throws an error if a collection is passed in without a defined relationship", assert => {
    let { schema } = this.helper;
    schema.foos.create();
    schema.foos.create();

    expect(function() {
      schema.tags.create({
        foos: schema.foos.all()
      });
    }).toThrow();
  });
});
