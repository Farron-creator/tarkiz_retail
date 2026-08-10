export type Company = {
  id: number;
  name: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
  logo?: number;
};

export type CompanyRequest = {
  name: string;
  region: string;
};

export type CompanyQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
};

export type File = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  originalname: string;
  path: string;
  extension: string;
  size: number;
};

