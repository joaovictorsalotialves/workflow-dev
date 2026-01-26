import chai from 'chai'
import chaiHttp from 'chai-http'
import { after } from 'mocha'
import sinon from 'sinon'
import app from '../../app.js'
import db from '../../db/dbconfig.js'
import EventosController from '../../controllers/eventosController.js'

chai.use(chaiHttp)
const { expect } = chai

let requester
before(() => {
  requester = chai.request.agent(app)
})

after(async () => {
  requester.close()
  await db.destroy()
})

let stub

describe('GET em /eventos', () => {
  it('Deve retornar uma lista de eventos', done => {
    stub = sinon.stub(EventosController, 'liberaAcessoEventos').returns(true)

    requester
      .get('/eventos')
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.have.property('id')
        expect(res.body[0]).to.have.property('nome')
        expect(res.body[0]).to.have.property('descricao')
        expect(res.body[0]).to.have.property('data')
        expect(res.body[0]).to.have.property('autor_id')
        expect(res.body[0]).to.have.property('created_at')
        expect(res.body[0]).to.have.property('updated_at')
        done()
      })
  })

  it('Deve retornar erro 404', done => {
    stub.restore()
    stub = sinon.stub(EventosController, 'liberaAcessoEventos').returns(false)

    requester
      .get('/eventos')
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(404)
        done()
      })
  })
})
