import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FichaItem extends BaseModel {
  static table = 'prato_itens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare qtdUtilizado: number

  @column()
  declare valorUtilizado: number

  @column()
  declare produtoId: number

  @column()
  declare pratoId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
