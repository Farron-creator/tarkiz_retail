import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconArrowBarToDown, IconArrowBarUp, IconChevronRight } from '@tabler/icons-react';

import { useOutletContext } from '@/features/outlet';
import { clsx, formatCurrency } from '@/utils/format';

import { useInfiniteProducts } from '../api';
import { Product, ProductQuery } from '../types';

import { ProductUpdateForm } from './ProductUpdateForm';

const defaultParams: ProductQuery = {
  page: 1,
  limit: 5,
};

export const ProductList: React.FC = () => {
  const { outlet } = useOutletContext();
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteProducts({
    params: { ...defaultParams, company: outlet?.company.id },
  });

  const products =
    data?.pages.reduce((prev, { result }) => [...prev, ...result], [] as Product[]) ?? [];

  function handleUpdate(product: Product) {
    return () => {
      if (!outlet?.company) return;

      modals.open({
        title: 'Update Barang',
        children: <ProductUpdateForm product={product} company={outlet.company.id} />,
      });
    };
  }

  return (
    <div>
      {products.map((product) => (
        <div
          key={product.id}
          className="py-3 active:bg-gray-100 transition rounded-lg px-5 cursor-pointer"
          onClick={handleUpdate(product)}
          aria-hidden
        >
          <div className="w-full flex items-center">
            <div
              className={clsx(
                'rounded-lg p-2',
                product.category == 'sale'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-orange-100 text-orange-600'
              )}
            >
              {product.category == 'purchase' ? (
                <IconArrowBarUp className="w-6 h-6" />
              ) : (
                <IconArrowBarToDown className="w-6 h-6" />
              )}
            </div>
            <div className="flex-grow px-3">
              <div className="text-sx font-bold">{product.name}</div>
              <div className="text-xs text-gray-600">{product.supplier?.name}</div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="font-bold">{formatCurrency(product.price)}</div>
              <div className="text-xs text-gray-600">/ {product.unit}</div>
            </div>
            <div className="flex-shrink-0 pl-2">
              <IconChevronRight className="w-6 h-6 text-gray-600" stroke={1.3} />
            </div>
          </div>
        </div>
      ))}
      <div className="px-5">
        {isFetching ? (
          <div className="text-center">loading...</div>
        ) : (
          hasNextPage && (
            <Button variant="subtle" fullWidth onClick={() => fetchNextPage()}>
              Lihat Semua
            </Button>
          )
        )}
      </div>
    </div>
  );
};
