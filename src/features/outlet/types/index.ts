import { Company } from '@/features/company';
import { Pagination } from '@/types/api';
import { BaseEntity } from '@/types/entity';

export type Outlet = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  company: Company;
} & BaseEntity;

export type OutletRequest = {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive';
  company: number;
};

export type OutletQuery = {
  keyword?: string;
  company?: number;
} & Pagination;
