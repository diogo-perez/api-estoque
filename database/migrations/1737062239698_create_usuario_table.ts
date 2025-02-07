import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.string('cpf', 11).notNullable().unique()
      table.string('senha').notNullable()
      table.enum('tipo', [1, 2, 3, 4, 5, 6]).notNullable()
      table.specificType('unidade_id', 'integer[]')
      table.boolean('is_ativo').notNullable().defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
