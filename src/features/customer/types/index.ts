import { Company } from '@/features/company';
import { Pagination } from '@/types/api';
import { BaseEntity } from '@/types/entity';

export type Customer = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  company: Company;
} & BaseEntity;

export type CustomerRequest = {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive';
  company: number;
};

export type CustomerQuery = {
  keyword?: string;
  company?: number;
  owner?: number;
  status?: 'active' | 'inactive';
} & Pagination;

export type CustomerCount = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};

export type CustomerCountQuery = {
  company?: number;
};
