import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ficha_tecnica_produtos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('ficha_tecnica_id')
        .unsigned()
        .references('id')
        .inTable('ficha_tecnica')
        .onDelete('CASCADE')
      table
        .integer('produto_id')
        .unsigned()
        .references('id')
        .inTable('produtos')
        .onDelete('CASCADE')
      table.float('quantidade').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
