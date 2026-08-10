import { ActionIcon, NumberInput } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

import { Product } from '@/features/product';
import { formatCurrency } from '@/utils/format';

import { SaleRequest } from '../types';

type ItemProps = {
  product: Product;
  value: number;
  onChange: (amount: number) => void;
};

const SaleItem: React.FC<ItemProps> = ({ product, value, onChange }) => {
  function handleChange(v: number | '') {
    if (v === '') return;

    onChange(v);
  }

  return (
    <div className="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-lg w-full px-5 py-3 mb-3">
      <div className="flex w-full">
        <div className="flex-grow flex items-center">
          <div>
            <h4 className="text-base font-bold">{product.name}</h4>
            <div className="text-sm text-gray-600">{formatCurrency(product.price)}</div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-shrink-0">
          <ActionIcon
            size={20}
            variant="filled"
            color="blue"
            radius="100%"
            onClick={() => handleChange(value - 1)}
          >
            <IconMinus className="p-px" />
          </ActionIcon>
          <NumberInput
            hideControls
            min={0}
            step={1}
            variant="unstyled"
            value={value}
            onChange={handleChange}
            className="[&_input]:w-8 [&_input]:text-center border-b border-gray-200 px-2"
          />
          <ActionIcon
            size={20}
            variant="filled"
            color="blue"
            radius="100%"
            onClick={() => handleChange(value + 1)}
          >
            <IconPlus className="p-px" />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};

type Props = {
  products: Product[];
  items: SaleRequest['items'];
  onChange: (item: SaleRequest['items']) => void;
};

export const SaleItemList: React.FC<Props> = ({ products, items, onChange }) => {
  function handleChange(product: Product) {
    return (quantity: number | '') => {
      if (quantity === '') return;

      if (quantity <= 0) {
        return onChange(items.filter((item) => item.product != product.id));
      }

      onChange(
        items.map((item) => {
          if (item.product == product.id) {
            return { ...item, quantity };
          }

          return item;
        })
      );
    };
  }

  return (
    <>
      {products
        .filter((product) => {
          return items.filter((item) => item.product == product.id).length > 0;
        })
        .map((product) => (
          <SaleItem
            key={product.id}
            product={product}
            value={items.filter((item) => item.product == product.id)[0].quantity ?? 1}
            onChange={handleChange(product)}
          />
        ))}
    </>
  );
};
