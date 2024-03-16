import run from '../index'
import request from 'supertest'
import {Server}from 'http'
describe('http',()=>{
    let server:Server
    beforeAll(()=>{
server=run(3002)
    })
    it('GET/admin',()=>{
return request(server) 
.get('/admin')
.expect(200)
.then(response=>{
    expect(response.body.length).toEqual(7)
    expect(response.body).toStrictEqual([1,2,3,4,5,6,7])
})
    })
    afterAll(async ()=>{
        server.close()
    })
})