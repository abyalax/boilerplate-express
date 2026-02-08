import { describe, it } from '@jest/globals'
import request from 'supertest'
import app from '../src/app'

describe('GET /greet', () => {
  it('should greet the world when no name is provided', async () => {
    const res = await request(app).get('/greet').expect('Content-Type', /json/).expect(200)
    console.log(res.body)
  })
})

describe('GET /api/users', () => {
  it('should send data paginated users', async () => {
    const { body } = await request(app).get('/api/users').expect('Content-Type', /json/).expect(200)
    console.log(JSON.stringify(body.data, null, 2))
  })
})
