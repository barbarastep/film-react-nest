import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 'Error message',
    description: 'Текст ошибки',
  })
  error: string;
}
