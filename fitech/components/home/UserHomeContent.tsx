import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MacrosCard } from '@/components/modules/MacrosCard';
import { UserActivitiesSection } from '@/components/modules/UserActivitiesSection';
import { UserFavoriteTrainersSection } from '@/components/modules/UserFavoriteTrainersSection';

export function UserHomeContent() {
  const styles = getStyles();

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.macrosCardWrap}>
        <MacrosCard />
      </View>
      <UserActivitiesSection />
      <UserFavoriteTrainersSection />
    </View>
  );
}

const getStyles = () =>
  StyleSheet.create({
    contentWrapper: {
      rowGap: 20,
    },
    macrosCardWrap: {
      width: '100%',
    },
  });
