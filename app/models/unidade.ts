import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Unidade extends BaseModel {
  static table = 'unidade'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare isAtivo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
