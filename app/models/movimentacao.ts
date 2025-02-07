import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Movimentacao extends BaseModel {
  static table = 'movimentacao'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare data: String

  @column()
  declare produtoId: number

  @column()
  declare movTipo: number

  @column()
  declare quantidade: number

  @column()
  declare usuarioId: number

  @column()
  declare unidadeId: number

  @column()
  declare observacao: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
