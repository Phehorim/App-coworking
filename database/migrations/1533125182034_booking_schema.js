'use strict'

const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.create('bookings', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('title').notNullable()
      table.string('duration').notNullable()
      table.string('type').notNullable()
      table.string('backgroundColor').notNullable()
      table.date('start').notNullable()
      table.date('end').notNullable()
      table.string('paid').notNullable()
      table.string('borderColor')
      table.string('url')
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingSchema
