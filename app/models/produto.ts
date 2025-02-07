import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Produto extends BaseModel {
  static table = 'produto'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare qtdMin: number

  @column()
  declare rendimento: number

  @column()
  declare valorPorcao: number

  @column()
  declare valor: number

  @column()
  declare valorReajuste: number

  @column()
  declare dataReajuste: String

  @column()
  declare quantidade: number

  @column()
  declare unidadeMedida: number

  @column()
  declare categoriaId: number

  @column()
  declare unidadeId: number

  @column()
  declare anexo: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
