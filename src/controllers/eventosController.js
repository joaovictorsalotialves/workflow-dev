import Eventos from '../models/evento.js'

// biome-ignore lint/complexity/noStaticOnlyClass: Controller class with only static methods
class EventosController {
  static listarEventos = async (_, res) => {
    try {
      const resultado = await Eventos.pegarEventos()
      return res.status(200).json(resultado)
    } catch (err) {
      return res.status(500).json(err.message)
    }
  }
}

export default EventosController
