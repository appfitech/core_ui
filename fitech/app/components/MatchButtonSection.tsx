import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { MatchScreenType } from '@/types/forms';

import { Button } from './Button';
import DiscardLottieButton from './lottie/DiscardLottieButton';
import HeartLottieButton from './lottie/HeartLottieButton';
import MuscleLottieButton from './lottie/MuscleLottieButton';

type Props = {
  onDiscard: () => void;
  onMatch: () => void;
  type: MatchScreenType;
  hideRefresh?: boolean;
  onRefresh: () => void;
};

export function MatchButtonSection({
  onDiscard,
  onMatch,
  hideRefresh = true,
  type,
  onRefresh,
}: Props) {
  const { theme } = useTheme();

  if (!hideRefresh) {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <Button
          type={'tertiary'}
          onPress={onRefresh}
          buttonStyle={{
            height: 70,
            width: 70,
            borderRadius: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="refresh" size={30} color={theme.dark100} />
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <DiscardLottieButton onPress={onDiscard} />

      {type === 'gymbro' && <MuscleLottieButton onPress={onMatch} />}
      {type === 'gymcrush' && <HeartLottieButton onPress={onMatch} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 150,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 20,
  },
});
