import { useGetLocations } from '@/lib/api/queries/use-get-locations';

import { Dropdown } from './Dropdown';

type Props = {
  id: string;
  value?: number | null;
  onChange: (locationId: number | undefined) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
};

export function LocalLocationPicker({
  id,
  value,
  onChange,
  label = '',
  placeholder = '',
  required = true,
}: Props) {
  const { data: locations } = useGetLocations();

  return (
    <Dropdown
      id={id}
      placeholder={placeholder}
      label={label}
      value={String(value)}
      onChange={(value) => onChange(value ? Number(value) : undefined)}
      options={
        locations?.map(({ id, fullName }) => ({
          label: fullName ?? '',
          value: id ? String(id) : '',
        })) ?? []
      }
      required={required}
    />
  );
}
