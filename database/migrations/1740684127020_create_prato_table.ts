import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'prato'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome')
      table.float('custo_total')
      table.float('qtd_rendimento')
      table.float('valor_rendimento')
      table.float('valor_venda')
      table.float('cmv_real')
      table.float('lucro_real')
      table.integer('unidade_id').notNullable().unsigned().references('id').inTable('unidade')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
