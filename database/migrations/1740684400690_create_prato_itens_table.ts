import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'prato_itens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('produto_id').notNullable().unsigned().references('id').inTable('produto')
      table.float('qtd_utilizado')
      table.float('valor_utilizado')
      table
        .integer('prato_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('prato')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
