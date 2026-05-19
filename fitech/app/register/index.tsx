import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { RegisterWizardHeader } from '@/components/register/RegisterWizardHeader';
import { RegisterStepAccountType } from '@/components/register/steps/RegisterStepAccountType';
import { RegisterStepBasicInfo } from '@/components/register/steps/RegisterStepBasicInfo';
import { RegisterStepCredentials } from '@/components/register/steps/RegisterStepCredentials';
import { RegisterStepDocument } from '@/components/register/steps/RegisterStepDocument';
import { REGISTER_STEPS } from '@/constants/register-steps';
import { ROUTES } from '@/constants/routes';
import { emptyUserWritable } from '@/constants/states';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import { useCreateUser } from '@/lib/api/mutations/user/use-create-user';
import { validateRegisterStep } from '@/lib/register/form';
import { UserDtoWritable } from '@/types/api/types.gen';
import { extractErrorMessage } from '@/utils/errors';
import { authStepEnter, authStepExit } from '@/utils/platform-animations';

const TOTAL_STEPS = REGISTER_STEPS.length;

export default function Register() {
  const styles = getStyles();
  const { showAlert } = useAlert();
  const router = useRouter();
  const { registerScreen } = TRANSLATIONS;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<UserDtoWritable>(emptyUserWritable);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: createUser, isPending } = useCreateUser();

  const currentStep = REGISTER_STEPS[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  const handleBack = useCallback(() => {
    if (isPending) return;

    if (step > 0) {
      setStep((prev) => prev - 1);
      return;
    }
    router.back();
  }, [isPending, router, step]);

  const handleNext = useCallback(() => {
    const error = validateRegisterStep(step, form, { confirmPassword });
    if (error) {
      showAlert({ title: 'Completa los campos', message: error });
      return;
    }
    setErrorMsg(null);
    setStep((prev) => prev + 1);
  }, [confirmPassword, form, showAlert, step]);

  const handleSubmit = useCallback(() => {
    const error = validateRegisterStep(step, form, { confirmPassword });
    if (error) {
      showAlert({ title: 'Completa los campos', message: error });
      return;
    }

    setErrorMsg(null);
    createUser(form, {
      onSuccess: () => {
        showAlert({
          title: registerScreen.successTitle,
          message: registerScreen.successMessage,
          buttons: [
            {
              text: registerScreen.successButton,
              onPress: () => router.replace(ROUTES.login),
            },
          ],
        });
      },
      onError: (error) => {
        setErrorMsg(
          extractErrorMessage(error) || registerScreen.registerErrorFallback,
        );
      },
    });
  }, [
    confirmPassword,
    createUser,
    form,
    registerScreen.registerErrorFallback,
    registerScreen.successButton,
    registerScreen.successMessage,
    registerScreen.successTitle,
    router,
    showAlert,
    step,
  ]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <RegisterStepAccountType form={form} setForm={setForm} />;
      case 1:
        return <RegisterStepDocument form={form} setForm={setForm} />;
      case 2:
        return <RegisterStepBasicInfo form={form} setForm={setForm} />;
      case 3:
        return (
          <RegisterStepCredentials
            form={form}
            setForm={setForm}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer
      authOptimized
      hasBackButton={false}
      hasNoTopPadding
      hasBottomPadding={false}
      footer={
        <Button
          label={
            isLastStep
              ? registerScreen.createAccountButton
              : registerScreen.nextButton
          }
          loadingLabel={
            isLastStep ? registerScreen.creatingAccountButton : undefined
          }
          onPress={isLastStep ? handleSubmit : handleNext}
          disabled={isPending}
          loading={isPending && isLastStep}
          animated={false}
          style={styles.primaryAction}
        />
      }
    >
      <RegisterWizardHeader
        step={step}
        total={TOTAL_STEPS}
        title={currentStep.title}
        subtitle={currentStep.subtitle}
        onBack={handleBack}
      />

      <ErrorBanner errorMessage={errorMsg} onClear={() => setErrorMsg(null)} />

      <Animated.View
        key={currentStep.id}
        entering={authStepEnter()}
        exiting={authStepExit()}
        style={styles.stepContent}
      >
        {renderStep()}
      </Animated.View>
    </PageContainer>
  );
}

const getStyles = () =>
  StyleSheet.create({
    stepContent: {
      rowGap: 12,
    },
    primaryAction: {
      width: '100%',
    },
  });
