import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RatingBreakdown = {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    stars: number;
    count: number;
    percentage: number;
  }[];
};

export const RatingDistribution = ({ data }: { data: RatingBreakdown }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distribución de Calificaciones</Text>
      {data?.breakdown?.map((item) => (
        <View key={item.stars} style={styles.row}>
          {/* Stars */}
          <View style={styles.stars}>
            {Array.from({ length: item.stars }).map((_, i) => (
              <FontAwesome key={i} name="star" size={14} color="#FFA500" />
            ))}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressFill, { width: `${item.percentage}%` }]}
            />
          </View>

          {/* Count */}
          <Text style={styles.count}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  stars: {
    flexDirection: 'row',
    width: 60,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 4,
  },
  count: {
    width: 20,
    textAlign: 'right',
  },
});
