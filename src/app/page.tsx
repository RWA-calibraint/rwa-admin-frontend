import { redirect } from 'next/navigation';

import { SIDE_BAR_LISTS, SIDE_BARS_KEYS } from '@helpers/sidebar-utils';

export default function Home() {
  redirect(SIDE_BAR_LISTS[SIDE_BARS_KEYS.DASHBOARD].URL);

  return <div className="d-flex width-100 height-100"></div>;
}
