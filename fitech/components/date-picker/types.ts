export type DatePickerOpenOptions = {
  value: string | null;
  onChange: (isoDate: string | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
};
