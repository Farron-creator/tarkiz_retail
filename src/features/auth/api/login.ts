import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { ErrorResponse } from '@/types/api';
import storage from '@/utils/storage';

import { Creds } from '../types';

import { CREDS_KEY } from './creds';

type LoginDTO = {
  data: {
    username: string;
    password: string;
  };
};

type LoginResponse = {
  token: string;
  creds: Creds;
};

export async function login({ data }: LoginDTO) {
  const res = await axios.post<LoginResponse, AxiosResponse<LoginResponse, ErrorResponse>>(
    '/auth/login',
    data
  );

  return res.data;
}

type UseLoginOption = {
  config?: MutationConfig<typeof login>;
};

export function useLogin({ config }: UseLoginOption = {}) {
  return useMutation(login, {
    onSuccess: ({ token }) => {
      storage.setToken(token);
      queryClient.invalidateQueries([CREDS_KEY]);
    },
    ...config,
  });
}
