import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import mongoose, { Model, Schema } from 'mongoose';

import { FilmEntity, FilmScheduleEntity } from './repository.types';

interface FilmScheduleDocument {
  id: string;
  daytime: string;
  hall: number | string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

interface FilmDocument {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: FilmScheduleDocument[];
}

@Injectable()
export class RepositoryService implements OnApplicationShutdown {
  private readonly logger = new Logger(RepositoryService.name);
  private readonly films: FilmEntity[];
  private readonly databaseDriver: string;
  private readonly databaseUrl: string;
  private filmModel: Model<FilmDocument> | null = null;
  private mongoReady = false;
  private mongoReadyPromise: Promise<void> | null = null;

  constructor(@Optional() private readonly configService?: ConfigService) {
    this.databaseDriver =
      this.configService?.get<string>('DATABASE_DRIVER') ?? 'memory';
    this.databaseUrl =
      this.configService?.get<string>('DATABASE_URL') ??
      'mongodb://127.0.0.1:27017/afisha';
    this.films = this.loadInitialFilms();
  }

  async getFilms(): Promise<FilmEntity[]> {
    if (this.isMongoDriver()) {
      await this.ensureMongoReady();
      const items = await this.filmModel!.find({}).lean();
      return items.map((item) => this.toFilmEntity(item));
    }

    return this.films;
  }

  async getFilmById(id: string): Promise<FilmEntity | undefined> {
    if (this.isMongoDriver()) {
      await this.ensureMongoReady();
      const item = await this.filmModel!.findOne({ id }).lean();
      return item ? this.toFilmEntity(item) : undefined;
    }

    return this.films.find((film) => film.id === id);
  }

  async getSchedule(filmId: string): Promise<FilmScheduleEntity[] | undefined> {
    const film = await this.getFilmById(filmId);
    return film?.schedule;
  }

  async getSession(
    filmId: string,
    sessionId: string,
  ): Promise<FilmScheduleEntity | undefined> {
    const film = await this.getFilmById(filmId);
    return film?.schedule.find((session) => session.id === sessionId);
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    if (this.isMongoDriver()) {
      await this.ensureMongoReady();
      const result = await this.filmModel!.updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              taken: { $ne: seatKey },
            },
          },
        },
        {
          $addToSet: {
            'schedule.$.taken': seatKey,
          },
        },
      );

      return result.modifiedCount > 0;
    }

    const session = this.films
      .find((film) => film.id === filmId)
      ?.schedule.find((currentSession) => currentSession.id === sessionId);

    if (!session || session.taken.includes(seatKey)) {
      return false;
    }

    session.taken.push(seatKey);
    return true;
  }

  async removeTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    if (this.isMongoDriver()) {
      await this.ensureMongoReady();
      await this.filmModel!.updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $pull: {
            'schedule.$.taken': seatKey,
          },
        },
      );
      return;
    }

    const session = this.films
      .find((film) => film.id === filmId)
      ?.schedule.find((currentSession) => currentSession.id === sessionId);
    if (!session) {
      return;
    }

    session.taken = session.taken.filter((takenSeat) => takenSeat !== seatKey);
  }

  private loadInitialFilms(): FilmEntity[] {
    const possiblePaths = [
      path.join(process.cwd(), 'test', 'mongodb_initial_stub.json'),
      path.join(process.cwd(), 'backend', 'test', 'mongodb_initial_stub.json'),
    ];

    const dataPath = possiblePaths.find((currentPath) =>
      fs.existsSync(currentPath),
    );

    if (!dataPath) {
      this.logger.warn(
        'Initial films data not found. In-memory repository is empty.',
      );
      return [];
    }

    try {
      const content = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(content) as FilmEntity[];
      return parsed;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown parse error';
      this.logger.error(`Failed to read initial films data: ${message}`);
      return [];
    }
  }

  private isMongoDriver(): boolean {
    return this.databaseDriver === 'mongodb' || this.databaseDriver === 'mongo';
  }

  private async ensureMongoReady(): Promise<void> {
    if (!this.isMongoDriver() || this.mongoReady) {
      return;
    }

    if (this.mongoReadyPromise) {
      await this.mongoReadyPromise;
      return;
    }

    this.mongoReadyPromise = (async () => {
      await mongoose.connect(this.databaseUrl);
      const scheduleSchema = new Schema<FilmScheduleDocument>(
        {
          id: { type: String, required: true },
          daytime: { type: String, required: true },
          hall: { type: Schema.Types.Mixed, required: true },
          rows: { type: Number, required: true },
          seats: { type: Number, required: true },
          price: { type: Number, required: true },
          taken: { type: [String], required: true, default: [] },
        },
        { _id: false },
      );

      const filmSchema = new Schema<FilmDocument>(
        {
          id: { type: String, required: true, index: true },
          rating: { type: Number, required: true },
          director: { type: String, required: true },
          tags: { type: [String], required: true },
          image: { type: String, required: true },
          cover: { type: String, required: true },
          title: { type: String, required: true },
          about: { type: String, required: true },
          description: { type: String, required: true },
          schedule: { type: [scheduleSchema], required: true, default: [] },
        },
        {
          collection: 'films',
          versionKey: false,
        },
      );

      this.filmModel = mongoose.models.Film
        ? (mongoose.model('Film') as Model<FilmDocument>)
        : mongoose.model<FilmDocument>('Film', filmSchema);
      this.mongoReady = true;
      this.logger.log(`MongoDB repository is enabled: ${this.databaseUrl}`);
    })();

    await this.mongoReadyPromise;
  }

  private toFilmEntity(source: FilmDocument): FilmEntity {
    return {
      id: source.id,
      rating: source.rating,
      director: source.director,
      tags: source.tags ?? [],
      image: source.image,
      cover: source.cover,
      title: source.title,
      about: source.about,
      description: source.description,
      schedule: (source.schedule ?? []).map((session) =>
        this.toScheduleEntity(session),
      ),
    };
  }

  private toScheduleEntity(source: FilmScheduleDocument): FilmScheduleEntity {
    return {
      id: source.id,
      daytime: source.daytime,
      hall: source.hall,
      rows: source.rows,
      seats: source.seats,
      price: source.price,
      taken: source.taken ?? [],
    };
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.mongoReady && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}
