import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movimentacao'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('data').notNullable()
      table.integer('produto_id').notNullable().unsigned().references('id').inTable('produto')
      table.enum('mov_tipo', [1, 2, 3]).notNullable()
      table.float('quantidade').notNullable()
      table.integer('usuario_id').notNullable().unsigned().references('id').inTable('usuario')
      table.integer('unidade_id').notNullable().unsigned().references('id').inTable('unidade')
      table.text('observacao', 'longText')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
