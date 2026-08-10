import { IconChevronLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { clsx } from '@/utils/format';

type Props = {
  title?: string;
  to?: string;
  withBorder?: boolean;
};

export const Navbar: React.FC<Props> = ({ title, to, withBorder }) => {
  const navigate = useNavigate();

  function goBack() {
    if (to) return navigate(to);

    if (window.history.length <= 1) {
      return navigate('/');
    }

    return navigate(-1);
  }

  return (
    <header className="pb-16">
      <div
        className={clsx(
          'px-4 fixed w-full max-w-md top-0 z-10 bg-white py-3.5',
          withBorder && 'border-b border-gray-200'
        )}
      >
        <button onClick={goBack} className="flex items-center bg-transparent">
          <IconChevronLeft className="text-gray-800" />
          <div className="font-bold ml-4">{title ?? 'Kembali'}</div>
        </button>
      </div>
    </header>
  );
};
