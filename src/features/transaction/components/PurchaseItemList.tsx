import { NumberInput, TextInput, UnstyledButton } from '@mantine/core';
import { useState } from 'react';

import { Product } from '@/features/product';

import { PurchaseRequest } from '../types';

type ItemValue = { price: number; quantity: number | '' };

type ItemProps = {
  product: Product;
  onChange: (amount: ItemValue) => void;
};

const PurchaseItem: React.FC<ItemProps> = ({ product, onChange }) => {
  const [value, setValue] = useState<ItemValue>({ quantity: 1, price: product.price });

  function handlePrice(price: number) {
    setValue({ ...value, price });
    onChange({ ...value, price });
  }

  function handleQuantity(quantity: number) {
    setValue({ ...value, quantity });
    onChange({ ...value, quantity });
  }

  function handleRemove() {
    setValue({ ...value, quantity: 0 });
    onChange({ ...value, quantity: 0 });
  }

  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-2 pt-3">
      <div className="col-span-12">
        <TextInput
          label="Nama Barang"
          value={product.name}
          readOnly
          rightSection={
            <UnstyledButton className="text-xs text-red-600 pr-4" onClick={handleRemove}>
              Hapus
            </UnstyledButton>
          }
        />
      </div>
      <div className="col-span-6">
        <NumberInput
          label="Harga"
          hideControls
          value={value.price}
          onChange={handlePrice}
          rightSection={<span className="text-xs text-gray-600 pr-4">/{product.unit}</span>}
        />
      </div>
      <div className="col-span-6">
        <NumberInput label="Jumlah" value={value.quantity} onChange={handleQuantity} />
      </div>
    </div>
  );
};

type Props = {
  products: Product[];
  items: PurchaseRequest['items'];
  onChange: (item: PurchaseRequest['items']) => void;
};

export const PurchaseItemList: React.FC<Props> = ({ products, items, onChange }) => {
  function handleChange(product: Product) {
    return ({ price, quantity }: ItemValue) => {
      if (quantity === '') return;

      if (quantity <= 0) {
        return onChange(items.filter((item) => item.product != product.id));
      }

      onChange(
        items.map((item) => {
          if (item.product == product.id) {
            return { ...item, price, quantity };
          }

          return item;
        })
      );
    };
  }

  return (
    <div className="divide-y space-y-4 divide-gray-300">
      {products
        .filter((product) => {
          return items.filter((item) => item.product == product.id).length > 0;
        })
        .map((product) => (
          <PurchaseItem key={product.id} product={product} onChange={handleChange(product)} />
        ))}
    </div>
  );
};
