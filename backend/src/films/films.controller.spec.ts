import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const mockFilmsService = {
      getFilms: jest.fn(),
      getFilmSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return films from service', async () => {
      const mockFilms = {
        total: 1,
        items: [
          {
            id: '1',
            rating: 8.0,
            director: 'Director',
            tags: [],
            title: 'Film 1',
            about: '',
            description: '',
            image: '',
            cover: '',
          },
        ],
      };
      service.getFilms.mockResolvedValue(mockFilms);

      const result = await controller.getFilms();

      expect(service.getFilms).toHaveBeenCalled();
      expect(result).toEqual(mockFilms);
    });
  });

  describe('getFilmSchedule', () => {
    it('should return film schedule from service', async () => {
      const mockSchedule = {
        total: 1,
        items: [
          {
            id: '1',
            daytime: '2023-01-01T10:00:00',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 100,
            taken: [],
          },
        ],
      };
      service.getFilmSchedule.mockResolvedValue(mockSchedule);

      const result = await controller.getFilmSchedule(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(service.getFilmSchedule).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
      expect(result).toEqual(mockSchedule);
    });
  });
});
