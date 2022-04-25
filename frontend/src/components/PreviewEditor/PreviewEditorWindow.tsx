import Close from '@material-ui/icons/Close';
import clsx from 'clsx';
import { IconButton } from 'czifui';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { PreviewEditorForm } from './PreviewEditorForm';

interface Props {
  open?: boolean;
  onClose?(): void;
}

const DEFAULT_LAYOUT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  anchorX: 0,
  anchorY: 0,
};

export function PreviewEditorWindow({ open, onClose }: Props) {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [isDragging, setIsDragging] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  function resetLayout() {
    setLayout((prev) => {
      const width = window.innerWidth * 0.6;
      const height = window.innerHeight * 0.7;

      return {
        ...prev,
        width,
        height,
        x: window.innerWidth / 2 - width / 2,
        y: window.innerHeight / 2 - height / 2,
      };
    });
  }

  useEffect(resetLayout, []);

  useEffect(() => {
    function isWithinDragContainer(target: Node | null) {
      return (
        target === windowRef.current || windowRef.current?.contains(target)
      );
    }

    function mouseDownHandler(event: MouseEvent) {
      if (isWithinDragContainer(event.target as Node | null)) {
        setIsDragging(true);
        setLayout((prev) => ({ ...prev, anchorX: event.x, anchorY: event.y }));
        document.documentElement.classList.add('no-select');
      }
    }

    function mouseUpHandler() {
      setIsDragging(false);
      setLayout((prev) => ({ ...prev, anchorX: 0, anchorY: 0 }));
      document.documentElement.classList.remove('no-select');
    }

    function mouseMoveHandler(event: MouseEvent) {
      if (isDragging) {
        setLayout((prev) => ({
          ...prev,
          anchorX: event.x,
          anchorY: event.y,
          x: prev.x + (event.x - prev.anchorX),
          y: prev.y + (event.y - prev.anchorY),
        }));
      }
    }

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [isDragging]);

  return (
    <>
      {open && (
        <motion.div
          className={clsx(
            'fixed z-50 bg-white shadow-xl',
            'border-2 border-napari-gray',
            'flex flex-col flex-auto p-6',
            isDragging ? 'cursor-move' : 'cursor-pointer',
          )}
          initial={layout}
          animate={layout}
          ref={windowRef}
        >
          <header className="flex justify-between">
            <h1 className="text-2xl">Preview Page Editor</h1>

            <IconButton
              onClick={() => {
                onClose?.();
                resetLayout();
              }}
            >
              <Close />
            </IconButton>
          </header>

          <PreviewEditorForm />
        </motion.div>
      )}
    </>
  );
}
