import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cmv_itens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('estoque_inicial').notNullable()
      table.float('valor_inicial').notNullable()
      table.integer('entrada').notNullable()
      table.float('valor_entrada').notNullable()
      table.integer('estoque_final').notNullable()
      table.float('valor_estoque_final').notNullable()
      table.integer('utilizado').notNullable()
      table.float('valor_utilizado').notNullable()
      table.integer('produto_id').unsigned().references('id').inTable('produto').onDelete('CASCADE')
      table.integer('cmv_id').unsigned().references('id').inTable('cmv').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
