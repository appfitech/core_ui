import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const MATCH_CARD_WIDTH = SCREEN_W * 0.92;
export const MATCH_CARD_HEIGHT = Math.min(560, SCREEN_H * 0.58);
export const MATCH_SWIPE_THRESHOLD = MATCH_CARD_WIDTH * 0.35;
