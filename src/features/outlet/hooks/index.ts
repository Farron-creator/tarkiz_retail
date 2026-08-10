import { useContext } from 'react';

import { OutletContext } from '../contexts';

export const useOutletContext = () => {
  return useContext(OutletContext);
};
