import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { get, identity, set } from 'lodash';
import { useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

import { previewStore } from '@/store/preview';
import { PluginAuthor, PluginData } from '@/types';

type PluginDataKeys = keyof PluginData;

interface StringArrayEditorProps {
  path: string;
  name?: string;
  formatValue?(value: string): unknown;
  formatData?(data: unknown): string;
}

function StringArrayEditor({
  path,
  name = path,
  formatValue = identity,
  formatData = identity,
}: StringArrayEditorProps) {
  const snap = useSnapshot(previewStore);
  const [currentValue, setCurrentValue] = useState('');

  const values = useMemo(
    () => (get(snap.plugin, path, []) as unknown[]).map(formatData) ?? [],
    [formatData, path, snap.plugin],
  );

  return (
    <div className="flex flex-col">
      <p className="text-base">{name}</p>

      <div className="flex flex-col p-2">
        <TextField
          className="mt-2"
          label="Name"
          required
          onKeyPress={(event) => {
            if (
              !currentValue ||
              event.key !== 'Enter' ||
              values.includes(currentValue)
            ) {
              return;
            }

            const store = get(previewStore.plugin, path, []) as unknown[];
            store.push(formatValue(currentValue) as never);

            setCurrentValue('');
          }}
          value={currentValue}
          onChange={(event) => setCurrentValue(event.target.value)}
          InputLabelProps={{ className: 'text-black text-sm' }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setCurrentValue('')}>
                <CloseIcon />
              </IconButton>
            ),
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {values.map((value) => (
            <Chip
              key={value}
              label={value}
              onDelete={() => {
                const metadataValues = get(snap.plugin, path, []) as unknown[];
                if (!previewStore.plugin) {
                  return;
                }

                set(
                  previewStore.plugin,
                  path,
                  metadataValues.filter((data) => formatData(data) !== value),
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PreviewEditorForm() {
  const snap = useSnapshot(previewStore);

  return (
    <div className="flex flex-col gap-y-6 overflow-auto p-6">
      {Object.entries(snap.plugin ?? {}).map(([rawKey, value]) => {
        const key = rawKey as PluginDataKeys;

        switch (true) {
          case key === 'description_text':
          case key === 'description_content_type':
            return null;

          case typeof value === 'string':
            return (
              <TextField
                multiline={key === 'description'}
                maxRows={12}
                className=""
                label={key}
                value={snap.plugin?.[key]}
                onChange={(event) =>
                  previewStore.plugin &&
                  set(previewStore.plugin, key, event.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        previewStore.plugin && set(previewStore.plugin, key, '')
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
                InputLabelProps={{ className: 'text-black text-base' }}
              />
            );

          case key === 'authors':
          case key === 'operating_system':
          case key === 'development_status':
          case key === 'requirements':
          case key === 'plugin_types':
          case key === 'writer_file_extensions':
          case key === 'reader_file_extensions':
          case key === 'writer_save_layers':
            return (
              <StringArrayEditor
                path={key}
                formatValue={(nextValue) => {
                  switch (key) {
                    case 'authors':
                      return {
                        name: nextValue,
                      };

                    case 'operating_system':
                      return `Operating System :: ${nextValue}`;

                    case 'development_status':
                      return `Development Status :: ${nextValue}`;

                    default:
                      return nextValue;
                  }
                }}
                formatData={(data) => {
                  switch (key) {
                    case 'authors': {
                      const author = data as PluginAuthor;
                      return author.name;
                    }

                    case 'operating_system': {
                      const os = data as string;
                      return os.replace('Operating System ::', '');
                    }

                    case 'development_status': {
                      const status = data as string;
                      return status.replace('Development Status ::', '');
                    }

                    default:
                      return data as string;
                  }
                }}
              />
            );

          case key === 'category':
            return (
              <StringArrayEditor
                name="supported_data"
                path="category.Supported data"
              />
            );

          // TODO Add support for editing these fields
          case key === 'category_hierarchy':
          case key === 'citations':
            return null;

          default:
            return (
              <p>
                {key}: {JSON.stringify(value)}
              </p>
            );
        }
      })}
    </div>
  );
}
