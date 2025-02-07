import Usuario from '#models/usuario'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Usuario.createMany([
      {
        nome: 'Mateus Pitta',
        cpf: '067.773.031-46',
        senha: '067773',
        tipo: 6,
        unidadeId: [1],
      },
    ])
  }
}
