import chai from 'chai'
import chaiHttp from 'chai-http'
import { after } from 'mocha'
import app from '../../app.js'
import db from '../../db/dbconfig.js'

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

describe('GET em /eventos', () => {
  it('Deve retornar uma lista de eventos', done => {
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
})
