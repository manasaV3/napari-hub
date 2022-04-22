import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import activity from '@/fixtures/activity.json';

export default function getPluginActivityStats(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const stats = get(activity, [req.query.plugin as string, 'stats'], null);

  if (stats) {
    res.json(stats);
  } else {
    res.status(404);
  }
}
