import { Platform } from 'react-native';

import { DatePickerOverlay as DatePickerOverlayAndroid } from './DatePickerOverlay.android';
import { DatePickerOverlay as DatePickerOverlayIOS } from './DatePickerOverlay.ios';

export const DatePickerOverlay =
  Platform.OS === 'ios' ? DatePickerOverlayIOS : DatePickerOverlayAndroid;
