import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cmv'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.float('faturamento').notNullable()
      table.float('valor_cmv').notNullable()
      table.integer('unidade_id').notNullable().unsigned().references('id').inTable('unidade')
      table.boolean('is_ativo').notNullable().defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
