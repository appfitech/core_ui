import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { FooterActions } from '@/components/FooterActions';
import PageContainer from '@/components/PageContainer';
import { PersonalInfoFormFields } from '@/components/personal-info/PersonalInfoFormFields';
import { PERSONAL_INFO_FORM_FIELDS } from '@/constants/forms';
import { useUpdateUser } from '@/lib/api/mutations/useUpdateUser';
import { isPersonalInfoFormValid } from '@/lib/personal-info/form';
import { useUserStore } from '@/stores/user';
import { UserResponseDtoReadable } from '@/types/api/types.gen';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const styles = getStyles();

  const user = useUserStore((s) => s.user?.user);
  const updateUserInfo = useUserStore((s) => s.updateUserInfo);

  const [form, setForm] = useState<UserResponseDtoReadable | undefined>(
    undefined,
  );

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const canSubmit = useMemo(() => isPersonalInfoFormValid(form), [form]);

  const handleUpdate = useCallback(() => {
    if (!form || !canSubmit) return;

    updateUser(form, {
      onSuccess: async (response) => {
        if (response.user) {
          await updateUserInfo(response.user as UserResponseDtoReadable);
        }
        router.back();
      },
    });
  }, [canSubmit, form, router, updateUser, updateUserInfo]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <PageContainer
      title="Editar Información Personal"
      style={styles.pageStyle}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={
        <FooterActions
          primaryLabel="Actualizar"
          onPrimary={handleUpdate}
          onCancel={handleCancel}
          primaryDisabled={!canSubmit}
          primaryLoading={isPending}
          cancelDisabled={isPending}
        />
      }
    >
      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <PersonalInfoFormFields
          fields={PERSONAL_INFO_FORM_FIELDS}
          form={form}
          setForm={setForm}
          isEmailVerified={user?.isEmailVerified}
        />
      </Animated.View>
    </PageContainer>
  );
}

const getStyles = () =>
  StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
  });
