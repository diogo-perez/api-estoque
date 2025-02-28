import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Ficha extends BaseModel {
  static table = 'prato'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare custoTotal: number

  @column()
  declare qtdRendimento: number

  @column()
  declare valorRendimento: number

  @column()
  declare valorVenda: number

  @column()
  declare cmvReal: number

  @column()
  declare lucroReal: number

  @column()
  declare unidadeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
