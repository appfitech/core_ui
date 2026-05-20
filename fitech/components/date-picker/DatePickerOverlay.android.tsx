/**
 * Android uses the system date dialog via `openAndroidDatePicker` from `DatePicker`.
 * This file exists so platform resolution stays consistent if the overlay is mounted.
 */
export function DatePickerOverlay() {
  return null;
}
