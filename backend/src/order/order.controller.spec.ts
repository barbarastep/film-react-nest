import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const mockOrder: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+1234567890',
        tickets: [
          {
            film: 'Film 1',
            session: 'Session 1',
            daytime: '2023-01-01T10:00:00',
            day: '2023-01-01',
            time: '10:00',
            row: 1,
            seat: 1,
            price: 100,
          },
        ],
      };
      const mockResult = {
        total: 1,
        items: [
          {
            id: 'order-1',
            film: 'Film 1',
            session: 'Session 1',
            daytime: '2023-01-01T10:00:00',
            day: '2023-01-01',
            time: '10:00',
            row: 1,
            seat: 1,
            price: 100,
          },
        ],
      };
      service.createOrder.mockResolvedValue(mockResult);

      const result = await controller.createOrder(mockOrder);

      expect(service.createOrder).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const mockOrder: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+1234567890',
        tickets: [
          {
            film: 'Film 1',
            session: 'Session 1',
            daytime: '2023-01-01T10:00:00',
            day: '2023-01-01',
            time: '10:00',
            row: 1,
            seat: 1,
            price: 100,
          },
        ],
      };
      service.createOrder.mockRejectedValue(new Error('Service error'));

      await expect(controller.createOrder(mockOrder)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
