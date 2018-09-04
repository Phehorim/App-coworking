'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('firstname', 80).notNullable()
      table.string('lastname', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('phone_number').notNullable().unique()
      table.string('address').notNullable()
      table.string('confirmation_token')
      table.boolean('is_active').defaultTo(0)
      table.boolean('is_admin').defaultTo(0)
      table.boolean('is_contractor').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
