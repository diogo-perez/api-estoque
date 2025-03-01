import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CMV extends BaseModel {
  static table = 'cmv'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare faturamento: number

  @column()
  declare valorCMV: number

  @column()
  declare unidadeId: number

  @column()
  declare isAtivo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
