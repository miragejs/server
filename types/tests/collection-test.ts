import { Collection } from 'miragejs';

type ModelType = { name: string };

const collection = new Collection<ModelType>();

collection.sort((a, b) => { return a.name.localeCompare(b.name) }) // $ExpectType Collection<ModelType>
collection.sort((a, b) => { return a.err.localeCompare(b.err) }) // $ExpectError

collection.add({ name: 'Bob' }) // $ExpectType any
collection.add({ err: 'err' }) // $ExpectError

collection.destroy() // $ExpectType any

collection.filter((item) => item.name === 'Bob') // $ExpectType Collection<ModelType>
collection.filter((item) => item.err === 'Err') // $ExpectError

collection.includes({ name: 'Bob' }) // $ExpectType boolean
collection.includes({ err: 'err' }) // $ExpectError

collection.mergeCollection(new Collection<ModelType>()) // $ExpectType Collection<ModelType>
collection.mergeCollection(new Collection<{ err: string }>()) // $ExpectError

collection.reload() // $ExpectType any

collection.remove({ name: 'Bob' }) // $ExpectType any
collection.remove({ err: 'Err' }) // $ExpectError

collection.save() // $ExpectType any

collection.slice(0, 1) // $ExpectType Collection<ModelType>

collection.update('name', 'John') // $ExpectType any
collection.update('name', new Date()) // $ExpectError
collection.update('err', 'err') // $ExpectError
