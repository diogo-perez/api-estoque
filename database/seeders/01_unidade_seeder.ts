import Unidade from '#models/unidade'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Unidade.createMany([
      {
        nome: 'DOCE PRESENCA',
      },
    ])
  }
}
