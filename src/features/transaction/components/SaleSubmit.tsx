import { Button } from '@mantine/core';

import { formatCurrency } from '@/utils/format';

import { SaleRequest } from '../types';

type Props = {
  items: SaleRequest['items'];
  onSubmit: () => void;
};

export const SaleSubmit: React.FC<Props> = ({ items, onSubmit }) => {
  const total = items.reduce((prev, curr) => prev + curr.quantity * (curr.price || 0), 0);

  return (
    <div className="max-w-md bottom-0 fixed bg-white py-4 w-full border-t border-gray-50 px-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600">Total</div>
          <div className="font-bold">{total > 0 ? formatCurrency(total) : '-'}</div>
        </div>

        <Button disabled={items.length == 0} onClick={onSubmit}>
          Checkout
        </Button>
      </div>
    </div>
  );
};
