import { NextApiRequest, NextApiResponse } from 'next';

import activity from '@/fixtures/activity.json';

export default function getActivityPlugins(
  _: NextApiRequest,
  res: NextApiResponse,
): void {
  res.json(Object.keys(activity));
}
