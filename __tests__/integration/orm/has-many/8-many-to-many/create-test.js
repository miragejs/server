import Helper from './_helper';
import { Model } from '@miragejs/server';
import { module, test } from 'qunit';

describe('Integration | ORM | Has Many | Many to Many | create', function(hooks) {
  hooks.beforeEach(function() {
    this.helper = new Helper();
    this.helper.schema.registerModel('foo', Model);
  });

  test('it sets up associations correctly when passing in the foreign key', assert => {
    let { schema } = this.helper;
    let product = schema.products.create();
    let order = schema.orders.create({
      productIds: [ product.id ]
    });

    product.reload();

    expect(order.productIds).toEqual([ product.id ]);
    expect(product.orderIds).toEqual([ order.id ]);
    expect(order.attrs.productIds).toEqual([ product.id ]);
    expect(product.attrs.orderIds).toEqual([ order.id ]);
    expect(order.products.models[0].attrs).toEqual(product.attrs);
    expect(product.orders.models[0].attrs).toEqual(order.attrs);
    expect(this.helper.db.orders.length).toEqual(1);
    expect(this.helper.db.products.length).toEqual(1);
    expect(this.helper.db.orders[0]).toEqual({ id: '1', productIds: [ '1' ] });
    expect(this.helper.db.products[0]).toEqual({ id: '1', orderIds: [ '1' ] });
  });

  test('it sets up associations correctly when passing in an array of models', assert => {
    let { schema } = this.helper;
    let product = schema.products.create();
    let order = schema.orders.create({
      products: [ product ]
    });

    product.reload();

    expect(order.productIds).toEqual([ product.id ]);
    expect(product.orderIds).toEqual([ order.id ]);
    expect(order.attrs.productIds).toEqual([ product.id ]);
    expect(product.attrs.orderIds).toEqual([ order.id ]);
    expect(this.helper.db.orders.length).toEqual(1);
    expect(this.helper.db.products.length).toEqual(1);
  });

  test('it sets up associations correctly when passing in a collection', assert => {
    let { schema } = this.helper;
    let product = schema.products.create();
    let order = schema.orders.create({
      products: schema.products.all()
    });

    product.reload();

    expect(order.productIds).toEqual([ product.id ]);
    expect(product.orderIds).toEqual([ order.id ]);
    expect(order.attrs.productIds).toEqual([ product.id ]);
    expect(product.attrs.orderIds).toEqual([ order.id ]);
    expect(this.helper.db.orders.length).toEqual(1);
    expect(this.helper.db.products.length).toEqual(1);
  });

  test('it throws an error if a model is passed in without a defined relationship', assert => {
    let { schema } = this.helper;

    expect(function() {
      schema.orders.create({
        foo: schema.create('foo')
      });
    }).toThrow();
  });

  test('it throws an error if an array of models is passed in without a defined relationship', assert => {
    let { schema } = this.helper;

    expect(function() {
      schema.orders.create({
        foos: [ schema.create('foo') ]
      });
    }).toThrow();
  });

  test('it throws an error if a collection is passed in without a defined relationship', assert => {
    let { schema } = this.helper;
    schema.foos.create();
    schema.foos.create();

    expect(function() {
      schema.orders.create({
        foos: schema.foos.all()
      });
    }).toThrow();
  });
});
