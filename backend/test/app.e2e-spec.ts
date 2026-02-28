import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Afisha API (e2e)', () => {
  let app: INestApplication;
  let filmId: string;
  let sessionId: string;
  let seatRow = 1;
  let seatNumber = 1;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/afisha/films', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.total).toBeGreaterThan(0);
      });

    filmId = response.body.items[0].id;
  });

  it('GET /api/afisha/films/:id/schedule', async () => {
    if (!filmId) {
      const films = await request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200);
      filmId = films.body.items[0].id;
    }

    const response = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.total).toBeGreaterThan(0);
      });

    sessionId = response.body.items[0].id;
    const session = response.body.items[0];
    const taken = new Set<string>(session.taken ?? []);
    let found = false;

    for (let row = 1; row <= session.rows && !found; row += 1) {
      for (let seat = 1; seat <= session.seats; seat += 1) {
        const seatKey = `${row}:${seat}`;
        if (!taken.has(seatKey)) {
          seatRow = row;
          seatNumber = seat;
          found = true;
          break;
        }
      }
    }

    expect(found).toBe(true);
  });

  it('POST /api/afisha/order', async () => {
    if (!filmId || !sessionId) {
      const films = await request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200);
      filmId = films.body.items[0].id;
      const schedule = await request(app.getHttpServer())
        .get(`/api/afisha/films/${filmId}/schedule`)
        .expect(200);
      sessionId = schedule.body.items[0].id;
      const session = schedule.body.items[0];
      const taken = new Set<string>(session.taken ?? []);
      let found = false;
      for (let row = 1; row <= session.rows && !found; row += 1) {
        for (let seat = 1; seat <= session.seats; seat += 1) {
          const seatKey = `${row}:${seat}`;
          if (!taken.has(seatKey)) {
            seatRow = row;
            seatNumber = seat;
            found = true;
            break;
          }
        }
      }
      expect(found).toBe(true);
    }

    await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'student@example.com',
        phone: '+79990000000',
        tickets: [
          { film: filmId, session: sessionId, row: seatRow, seat: seatNumber },
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(1);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items[0].film).toBe(filmId);
      });
  });
});
