import { User } from '@/features/auth';
import { Product } from '@/features/product';
import { Pagination } from '@/types/api';
import { BaseEntity } from '@/types/entity';

export type TransactionStatus = 'approved' | 'accepted' | 'canceled';

export type SaleItem = {
  id: number;
  price: number;
  quantity: number;
  total: number;
  product: Product;
};

export type Sale = {
  code: string;
  customer: string;
  status: TransactionStatus;
  note: string;
  total: number;
  user: User;
  items: SaleItem[];
  date: Date;
} & BaseEntity;

export type SaleRequest = {
  customer: string;
  note: string;
  source: 'outlet' | 'warehouse';
  sourceId: number;
  date: Date;
  items: Array<{
    price?: number;
    quantity: number;
    product: number;
  }>;
};

export type SaleQuery = {
  outlet?: number | string;
  status?: TransactionStatus[];
  startDate?: Date;
  endDate?: Date;
} & Pagination;

export type PurchaseItem = {
  id: number;
  price: number;
  quantity: number;
  total: number;
  type: 'stock' | 'disposable';
  product: Product;
};

export type Purchase = {
  code: string;
  note: string;
  total: number;
  items: PurchaseItem[];
  status: TransactionStatus;
  user: User;
  date: Date;
} & BaseEntity;

export type PurchaseRequest = {
  note: string;
  source: 'outlet' | 'warehouse';
  sourceId: number;
  date: Date;
  items: Array<{
    price?: number;
    quantity: number;
    product: number;
    type: 'stock' | 'disposable';
  }>;
};

export type PurchaseQuery = {
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
  status?: TransactionStatus[];
} & Pagination;


export type ExpenseItem = {
  id: number;
  price: number;
  quantity: number;
  total: number;
  type: 'stock' | 'disposable';
  product: Product;
};

export type Expense = {
  code: string;
  note: string;
  total: number;
  items: PurchaseItem[];
  status: TransactionStatus;
  user: User;
  date: Date;
} & BaseEntity;

export type ExpenseRequest = {
  note: string;
  source: 'outlet' | 'warehouse';
  sourceId: number;
  date: Date;
  accountCategory: string;
  employee_id: number;
  items: Array<{
    price?: number;
    quantity: number;
    product: number;
    type: 'stock' | 'disposable';
  }>;
};

export type ExpenseQuery = {
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
  status?: TransactionStatus[];
} & Pagination;

export type SalesSummary = {
  id: number;
  date: string;
  name: string;
  quantity: number;
  total: number;
};

export type SalesSummaryQuery = {
  status?: TransactionStatus[];
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
};

export type PurchasesSummary = {
  id: number;
  date: string;
  name: string;
  quantity: number;
  total: number;
};

export type PurchasesSummaryQuery = {
  status?: TransactionStatus[];
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
};

export type ExpensesSummary = {
  id: number;
  date: string;
  name: string;
  quantity: number;
  total: number;
};

export type ExpensesSummaryEach = {
  id: number;
  date: string;
  note: string;
  name: string;
  quantity: number;
  total: number;
};

export type ExpensesSummaryQuery = {
  status?: TransactionStatus[];
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
};




export type AdjustmentItem = {
  id: number;
  price: number;
  quantity: number;
  total: number;
  type: 'stock' | 'disposable';
  product: Product;
};

export type Adjustment = {
  code: string;
  note: string;
  total: number;
  category?: string;
  items: AdjustmentItem[];
  status: TransactionStatus;
  user: User;
  date: Date;
} & BaseEntity;

export type AdjustmentRequest = {
  note: string;
  source: 'outlet' | 'warehouse';
  sourceId: number;
  date: Date;
  category: string;
  items: Array<{
    price?: number;
    quantity: number;
    product: number;
    type: 'stock' | 'disposable';
  }>;
};

export type AdjustmentQuery = {
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
  status?: TransactionStatus[];
} & Pagination;

export type AdjustmentsSummary = {
  id: number;
  date: string;
  name: string;
  quantity: number;
  total: number;
};

export type AdjustmentsSummaryQuery = {
  status?: TransactionStatus[];
  outlet?: number | string;
  startDate?: Date;
  endDate?: Date;
};