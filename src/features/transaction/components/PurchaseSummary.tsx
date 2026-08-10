import { Product } from '@/features/product';
import { formatCurrency } from '@/utils/format';

import { PurchaseRequest } from '../types';

type ItemProps = {
  items: PurchaseRequest['items'];
  product: Product;
};

const TransactionItem: React.FC<ItemProps> = ({ product, items }) => {
  const item = items.filter((item) => product.id == item.product).at(0);

  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="text-gray-700 font-bold">{product.name}</div>
        <div className="text-gray-500 text-xs font-medium">
          {item?.quantity} x {formatCurrency(item?.price || product.price)}
        </div>
      </div>
      <div>{formatCurrency((item?.price || product.price) * (item?.quantity || 1))}</div>
    </div>
  );
};

type Props = {
  items: PurchaseRequest['items'];
  total: number;
  products: Product[];
};

export const PurchaseSummary: React.FC<Props> = ({ total, items, products }) => {
  if (items.length == 0) return null;

  return (
    <section className="mt-6 px-5">
      <div className="bg-white shadow-lg shadow-gray-100 rounded-xl p-5 font-bold text-sm mb-2">
        {products
          .filter((product) => items.filter((item) => item.product == product.id).length > 0)
          .map((product) => (
            <TransactionItem key={product.id} product={product} items={items} />
          ))}

        <div className="flex items-center justify-between border-t text-base border-dashed border-gray-400 pt-3">
          <div>Total</div>
          <div>{formatCurrency(total)}</div>
        </div>
      </div>
    </section>
  );
};
