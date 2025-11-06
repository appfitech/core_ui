import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSearchTrainers } from '@/app/api/mutations/use-search-trainers';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';
import { getUserAvatarURL } from '@/utils/user';

import { AppText } from '../AppText';
import { Card } from '../Card';
import { HomeSectionContainer } from '../HomeSectionContainer';

export function UserFavoriteTrainersSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const token = useUserStore((s) => s.getToken());

  const [trainers, setTrainers] = useState<PublicTrainerDtoReadable[]>([]);

  const { mutate: searchTrainers } = useSearchTrainers();

  useEffect(() => {
    if (!token) {
      return;
    }

    searchTrainers(
      { query: '' },
      {
        onSuccess: (data) => setTrainers(data),
      },
    );
  }, [token]);

  return (
    <HomeSectionContainer
      title="Entrenadores destacados"
      onClick={() => router.push(ROUTES.trainers)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: 16 }}
      >
        {trainers?.slice(0, 5)?.map((trainer, index) => (
          <TouchableOpacity
            key={`trainer-card-${trainer.id}-${index}`}
            onPress={() => router.push(`${ROUTES.trainers}/${trainer.id}`)}
          >
            <Card
              key={trainer?.id}
              style={[
                styles.card,
                {
                  maxWidth: 200,
                  alignSelf: 'flex-start',
                },
              ]}
            >
              <View style={{ rowGap: 8 }}>
                <Image
                  source={{ uri: getUserAvatarURL(trainer?.person) }}
                  style={[styles.avatar]}
                />
                <AppText
                  style={{
                    fontWeight: '600',
                    fontSize: 15,
                    color: theme.dark900,
                  }}
                >
                  {`${trainer?.person?.firstName} ${trainer?.person?.lastName}`}
                </AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 14 }}>
                  {truncateWords(trainer?.person?.bio ?? '', 20)}
                </AppText>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </HomeSectionContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.dark200,
      flex: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
  });
