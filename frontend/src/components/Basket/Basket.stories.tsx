import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Basket } from './Basket';

const meta = {
  title: 'UI/Basket',
  component: Basket,
  parameters: {
    layout: 'centered',
  },
  args: {
    onDelete: fn(),
  },
} satisfies Meta<typeof Basket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        film: 'Недостижимая утопия',
        place: 'A1',
        session: '10:00',
        price: '1000 ₽',
      },
      {
        id: '2',
        film: 'Парадокс Нексуса',
        place: 'A2',
        session: '10:00',
        price: '1000 ₽',
      },
      {
        id: '3',
        film: 'Стражи Гримуара',
        place: 'A3',
        session: '10:00',
        price: '1000 ₽',
      },
    ]
  },
};
