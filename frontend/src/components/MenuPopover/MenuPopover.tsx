import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import clsx from 'clsx';

import { Close } from '@/components/icons';
import { Link } from '@/components/Link';
import { LinkInfo } from '@/types';

import styles from './MenuPopover.module.scss';

interface Props {
  anchorEl: HTMLElement | null;
  items: LinkInfo[];
  onClose: () => void;
  visible: boolean;
}

/**
 * Popover menu for rendering a list of links.
 */
export function MenuPopover({ anchorEl, items, onClose, visible }: Props) {
  return (
    <Popover
      anchorEl={anchorEl}
      className="flex flex-row-reverse"
      classes={{
        paper: clsx(
          styles.menuPopover,
          'bg-black static flex flex-row',
          'p-sds-xl  h-[min-content] max-w-[325px]',
        ),
      }}
      onClose={onClose}
      open={visible}
      data-testid="menu"
      transitionDuration={visible ? 250 : 200}
    >
      <ul className="text-white flex-grow">
        {items.map((item) => (
          <li
            className="flex items-center mb-sds-xl last:m-0"
            key={item.title}
            data-testid="menuItem"
          >
            <Link
              className="mr-sds-xxs"
              href={item.link}
              newTab={item.newTab}
              onClick={onClose}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      <IconButton
        className="self-start p-0"
        data-testid="menuClose"
        onClick={onClose}
        size="large"
      >
        <Close />
      </IconButton>
    </Popover>
  );
}
