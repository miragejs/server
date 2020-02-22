import {
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  Model,
  Registry
} from "miragejs";
import Schema from "miragejs/orm/schema";

const registryBelongsTo: BelongsTo<PersonRegistry> = belongsTo;
const registryHasMany: HasMany<PersonRegistry> = hasMany;

const PersonModel = Model.extend({
  name: "hello",
  parent: registryBelongsTo("person"),
  pets: registryHasMany("pet"),
  friends: registryHasMany<"pet" | "person">({ polymorphic: true })
});

const PetModel = Model.extend({
  name: "fido",
  owner: registryBelongsTo("person")
});

type PersonRegistry = Registry<
  { person: typeof PersonModel; pet: typeof PetModel },
  {}
>;
declare const schema: Schema<PersonRegistry>;

const people = schema.all("person");

people.length; // $ExpectType number
people.modelName; // $ExpectType string
people.models.map(model => {
  model.parent?.name; // $ExpectType string | undefined
  model.parent?.parent?.name; // $ExpectType string | undefined
  model.pets.models[0].name; // $ExpectType string

  // Polymorphic relationship
  const friend = model.friends.models[0];

  // Both 'pet' and 'person' models have a name, but no other shared fields
  friend.name; // $ExpectType string
  friend.parent; // $ExpectError
  friend.friends; // $ExpectError
  friend.owner; // $ExpectError

  if ("parent" in friend) {
    // Here we know friend is a person
    friend.parent!.name; // $ExpectType string
    friend.friends.length; // $ExpectType number
  } else {
    // Here we know friend is a pet
    friend.owner!.name; // $ExpectType string
  }
});

const child = schema.create("person", {
  parent: schema.create("person")
});

// Here we know `parent` is defined because it was just passed in
child.parent.name; // $ExpectType string

schema.create("person", { parent: "hi" }); // $ExpectError

const pet1 = schema.create("pet");
const pet2 = schema.create("pet");

// We can instantiate a hasMany with either an array or a collection
// Either way, the instance should have a collection.

const personWithPetsArray = schema.create("person", {
  pets: [pet1, pet2]
});

personWithPetsArray.pets.modelName; // $ExpectType string

const personWithPetsCollection = schema.create("person", {
  pets: schema.all("pet")
});

personWithPetsCollection.pets.modelName; // $ExpectType string

schema.create("person", { pets: [child] }); // $ExpectError
schema.create("person", { pets: schema.all("person") }); // $ExpectError
