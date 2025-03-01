import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CMVItem extends BaseModel {
  static table = 'cmv_itens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare estoqueInicial: number

  @column()
  declare valorInicial: number

  @column()
  declare entrada: number

  @column()
  declare valorEntrada: number

  @column()
  declare estoqueFinal: number

  @column()
  declare valorEstoqueFinal: number

  @column()
  declare utilizado: number

  @column()
  declare valorUtilizado: number

  @column()
  declare produtoId: number

  @column()
  declare cmvId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
