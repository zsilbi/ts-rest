import { describe, it, expect } from 'bun:test';
import { app } from './index';
import request from 'supertest';

const expectRes = (res: any) => {
  return expect({ body: res.body, status: res.status });
};

describe('arktype', () => {
  it('should be able to get', async () => {
    const res = await request(app).get('/pokemon/1');

    expectRes(res).toStrictEqual({
      status: 200,
      body: {
        id: 1,
        name: 'Charizard',
      },
    });
  });

  it('should do param validation', async () => {
    const res = await request(app).get('/pokemon/foo');

    expectRes(res).toStrictEqual({
      status: 400,
      body: {
        issues: [
          {
            actual: 'NaN',
            code: 'domain',
            data: null,
            description: 'a number',
            domain: 'number',
            expected: 'a number',
            message: 'id must be a number (was NaN)',
            meta: {},
            path: ['id'],
            problem: 'must be a number (was NaN)',
          },
        ],
        name: 'ValidationError',
      },
    });
  });

  it('delete with no body and no return body', async () => {
    const res = await request(app).delete('/pokemon/1');

    expectRes(res).toStrictEqual({
      status: 200,
      body: {},
    });
  });

  it('update', async () => {
    const res = await request(app)
      .patch('/pokemon/1')
      .send({ name: 'pikachu' });

    expectRes(res).toStrictEqual({
      status: 200,
      body: {
        message: 'updated 1 to pikachu',
      },
    });
  });
});
