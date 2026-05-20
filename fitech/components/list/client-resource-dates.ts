import { TRANSLATIONS } from '@/constants/strings';
import { moment } from '@/utils/dates';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

export function getClientResourceValidityValue(resource: {
  startDate?: string;
  endDate?: string;
}) {
  const { clientResourceScreen: copy, common } = TRANSLATIONS;

  if (resource.startDate && resource.endDate) {
    return copy.dateRange
      .replace('{start}', formatDate(resource.startDate))
      .replace('{end}', formatDate(resource.endDate));
  }
  if (resource.startDate) {
    return copy.dateFrom.replace('{date}', formatDate(resource.startDate));
  }
  if (resource.endDate) {
    return copy.dateUntil.replace('{date}', formatDate(resource.endDate));
  }
  return common.dash;
}
