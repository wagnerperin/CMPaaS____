const supertest = require('supertest');
const app = require('../server');
const mongo = require('../conf/mongo');
const mapModel = require('mongoose').model('Map');;
const mapVersionModel = require('mongoose').model('MapVersion');;

const clearMapDB = () => {
    return mapModel.deleteMany({});
};
const clearMapVersionDB = () => {
    return mapVersionModel.deleteMany({});
};    

describe('### Map API Testing Set ###', () => {
  afterAll(async () => {
    await clearMapDB();
    await clearMapVersionDB();
 }),
  test('POST - a valid post request', async () => {
    const res = await supertest(app).post('/map').send({
        "title": "Primeiro Mapa",
        "description": "Primeiro Mapa",
        "question": "O que é um mapa conceitual?",
        "keywords": "mapa, conceitual, primeiro",
        "initial_content": {
            "nodeDataArray": [{
                    "key": 1, 
                    "text": "Concept A",
                    "category": "concept",
                    "loc": "-235 -5",
                    "group": 4
                },{
                    "key": 2, 
                    "text": "Relation 1",
                    "category": "relation",
                    "loc": "-134 -5",
                    "group": 4
                }, {
                    "key": 3,
                    "text": "Concept B",
                    "category": "concept",
                    "loc": "-40 -5",
                    "group": 4
                }, {
                    "key": 4,
                    "text": "SubMap 1",
                    "isGroup": true,
                    "category": "map",
                    "loc": "-240 -5"
                }, {
                    "key": 5, 
                    "text": "Relation 2",
                    "category": "relation",
                    "loc": "78 -14"
                }, {
                    "key": 6, 
                    "text": "Concept C",
                    "category": "concept",
                    "loc": "181 -14"
                }
    
            ],
            "linkDataArray": [{
                    "from": 1,
                    "to": 2
                }, {
                    "from": 2,
                    "to": 3
                }, {
                    "from": 4,
                    "to": 5
                },
                {
                    "from": 5,
                    "to": 6
                }
            ] 
        }
    });
    expect(res.status).toBe(201);
  });
});
afterAll(async () => {
    return await mongo.disconnect();
});