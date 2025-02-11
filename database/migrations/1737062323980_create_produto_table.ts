import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.float('qtd_min').notNullable()
      table.float('rendimento').notNullable()
      table.float('valor_porcao').notNullable()
      table.float('valor').notNullable()
      table.float('valor_reajuste')
      table.float('data_reajuste')
      table.float('quantidade').notNullable()
      table.enum('unidade_medida', [1, 2, 3, 4, 5]).notNullable()
      table.integer('categoria_id').notNullable().unsigned().references('id').inTable('categoria')
      table.integer('unidade_id').notNullable().unsigned().references('id').inTable('unidade')
      table.string('anexo')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
