import { get } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import activity from '@/fixtures/activity.json';

export default function getPluginActivityData(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const stats = get(activity, [req.query.plugin as string, 'points'], null);

  if (stats) {
    res.json(stats);
  } else {
    res.status(404);
  }
}
