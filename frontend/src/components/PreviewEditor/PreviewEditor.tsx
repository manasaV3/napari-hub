import Edit from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { PreviewEditorWindow } from './PreviewEditorWindow';

export function PreviewEditor() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <>
            <motion.button
              key="div"
              className={clsx(
                'z-50 w-14 h-14 rounded-full',
                'fixed bottom-6 right-6',
                'bg-napari-primary hover:bg-napari-hover',
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setOpen(true)}
              type="button"
            >
              <Edit />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <PreviewEditorWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
