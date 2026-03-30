import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Afisha API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/afisha/films', () => {
    return request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200)
      .expect(({ body }) => {
        expect(body.total).toBeGreaterThan(0);
        expect(Array.isArray(body.items)).toBe(true);
      });
  });

  it('GET /api/afisha/films/:id/schedule', async () => {
    const filmsResponse = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    const filmId = filmsResponse.body.items[0]?.id as string | undefined;
    expect(filmId).toBeDefined();

    return request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body.items)).toBe(true);
      });
  });

  it('POST /api/afisha/order reserves a free seat', async () => {
    const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
    const scheduleResponse = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200);

    const sessions = scheduleResponse.body.items as Array<{
      id: string;
      daytime: string;
      rows: number;
      seats: number;
      price: number;
      taken: string[];
    }>;

    const targetSession = sessions.find(
      (session) => session.rows * session.seats > session.taken.length,
    );

    expect(targetSession).toBeDefined();

    if (!targetSession) {
      throw new Error('Could not find a session with free seats');
    }

    let row = 1;
    let seat = 1;
    const taken = new Set(targetSession.taken);

    outer: for (
      let currentRow = 1;
      currentRow <= targetSession.rows;
      currentRow += 1
    ) {
      for (
        let currentSeat = 1;
        currentSeat <= targetSession.seats;
        currentSeat += 1
      ) {
        const seatKey = `${currentRow}:${currentSeat}`;
        if (!taken.has(seatKey)) {
          row = currentRow;
          seat = currentSeat;
          break outer;
        }
      }
    }

    return request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@example.com',
        phone: '+79999999999',
        tickets: [
          {
            film: filmId,
            session: targetSession.id,
            daytime: targetSession.daytime,
            day: '28 июня',
            time: '10:00',
            row,
            seat,
            price: targetSession.price,
          },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.total).toBe(1);
        expect(body.items[0].film).toBe(filmId);
        expect(body.items[0].session).toBe(targetSession.id);
        expect(body.items[0].row).toBe(row);
        expect(body.items[0].seat).toBe(seat);
      });
  });
});
