export const TRANSLATIONS = {
  welcomeScreen: {
    header: '¡Bienvenido a FITECH!',
    subheader: 'Tu mejor versión está a punto de activarse.',
    createAccountButton: 'Crear cuenta',
    logInButton: 'Iniciar sesión',
  },
  loginScreen: {
    header: 'Inicia sesión en tu \ncuenta',
    subheader: 'Entrena. Mejora. Repite.',
    loginGoogleButton: 'Continuar con Google',
    loginButton: 'Iniciar sesión',
    loginLoadingButton: 'Iniciando sesión…',
    forgotPasswordLink: '¿Olvidaste tu contraseña?',
    alternativeLoginCaption: 'O inicia sesión con',
    loginErrorFallback:
      'Ocurrió un error al iniciar sesión. Inténtalo nuevamente.',
  },
  registerScreen: {
    nextButton: 'Siguiente',
    createAccountButton: 'Crear cuenta',
    creatingAccountButton: 'Creando tu cuenta…',
    registerErrorFallback:
      'No pudimos crear tu cuenta. Revisa los datos e inténtalo de nuevo.',
    successTitle: '¡Cuenta creada!',
    successMessage:
      'Tu cuenta fue creada correctamente. Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.',
    successButton: 'Ir a iniciar sesión',
  },
  verifyEmailScreen: {
    title: 'Verifica tu correo',
    verifying: 'Verificando tu correo electrónico…',
    successTitle: '¡Correo verificado!',
    successMessage:
      'Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.',
    missingToken:
      'El enlace de verificación no es válido. Revisa el correo e inténtalo de nuevo.',
    errorFallback:
      'No pudimos verificar tu correo. El enlace puede haber expirado.',
    goToLogin: 'Ir a iniciar sesión',
    retryButton: 'Reintentar',
  },
  forgotPasswordScreen: {
    title: '¿Olvidaste tu contraseña?',
    description:
      '¡No te preocupes! Ingresa el correo asociado a tu cuenta y te enviaremos instrucciones para restablecerla.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@correo.com',
    submitButton: 'Enviar',
    emailRequired: 'Ingresa tu correo electrónico.',
    emailInvalid: 'Ingresa un correo electrónico válido.',
    successTitle: 'Revisa tu correo',
    successMessage:
      'Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.',
  },
  common: {},
};
