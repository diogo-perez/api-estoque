import Categoria from '#models/categoria'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Categoria.createMany([
      {
        nome: 'Doce',
        unidadeId: 1,
      },
    ])
  }
}
