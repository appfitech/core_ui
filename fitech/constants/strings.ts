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
    cancelRegisterButton: 'Cancelar registro',
    cancelRegisterTitle: '¿Abandonar registro?',
    cancelRegisterMessage:
      'Saldrás del proceso de registro. Los datos que ingresaste no se guardarán.',
    cancelRegisterStay: 'Seguir registrándome',
    cancelRegisterLeave: 'Salir',
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
      'No pudimos verificar tu correo. Inténtalo de nuevo en unos minutos.',
    invalidToken:
      'Este enlace no es válido o ya expiró. Si ya verificaste tu correo, inicia sesión. Si no, revisa tu bandeja y abre el enlace más reciente.',
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
    errorFallback:
      'No pudimos enviar el correo. Inténtalo de nuevo en unos minutos.',
  },
  changePasswordScreen: {
    title: 'Cambiar contraseña',
    introTitle: 'Antes de continuar',
    introBody:
      'Por seguridad, al cambiar tu contraseña cerraremos tu sesión en este dispositivo. Deberás iniciar sesión de nuevo con tu nueva contraseña.',
    currentPasswordLabel: 'Contraseña actual',
    currentPasswordPlaceholder: 'Tu contraseña actual',
    newPasswordLabel: 'Nueva contraseña',
    newPasswordPlaceholder: 'Mínimo 6 caracteres',
    confirmPasswordLabel: 'Confirmar nueva contraseña',
    confirmPasswordPlaceholder: 'Repite la nueva contraseña',
    submitButton: 'Cambiar contraseña',
    cancelButton: 'Cancelar',
    currentRequired: 'Ingresa tu contraseña actual.',
    passwordRequired: 'Ingresa tu nueva contraseña.',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres.',
    confirmRequired: 'Confirma tu nueva contraseña.',
    passwordsMismatch: 'Las contraseñas no coinciden.',
    sameAsCurrent: 'La nueva contraseña debe ser distinta a la actual.',
    confirmTitle: '¿Cambiar contraseña?',
    confirmMessage:
      'Se cerrará tu sesión y tendrás que iniciar sesión con la nueva contraseña.',
    confirmAction: 'Sí, cambiar',
    confirmCancel: 'No, volver',
    successTitle: 'Contraseña actualizada',
    successMessage: 'Inicia sesión con tu nueva contraseña.',
    successButton: 'Ir a iniciar sesión',
    errorFallback:
      'No pudimos cambiar tu contraseña. Verifica la contraseña actual e inténtalo de nuevo.',
  },
  deleteAccountScreen: {
    title: 'Eliminar cuenta',
    introTitle: 'Esta acción es permanente',
    bullets: [
      'Se eliminará tu perfil, fotos y datos personales.',
      'Perderás acceso a rutinas, dietas, contratos y chats asociados a tu cuenta.',
      'Las suscripciones o contratos activos pueden cancelarse según las políticas de la plataforma.',
      'No podrás recuperar la cuenta después de confirmar.',
    ],
    note: 'La eliminación definitiva estará disponible cuando el servidor habilite este proceso.',
    cancelButton: 'Cancelar',
    confirmButton: 'Eliminar mi cuenta',
    unavailableTitle: 'Próximamente',
    unavailableMessage:
      'La eliminación de cuenta aún no está disponible. Contacta a soporte si necesitas cerrar tu cuenta.',
  },
  resetPasswordScreen: {
    title: 'Nueva contraseña',
    description: 'Elige una contraseña segura para tu cuenta.',
    passwordLabel: 'Nueva contraseña',
    passwordPlaceholder: 'Mínimo 6 caracteres',
    confirmPasswordLabel: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Repite tu contraseña',
    submitButton: 'Guardar contraseña',
    passwordRequired: 'Ingresa tu nueva contraseña.',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres.',
    confirmRequired: 'Confirma tu nueva contraseña.',
    passwordsMismatch: 'Las contraseñas no coinciden.',
    missingToken:
      'El enlace para restablecer la contraseña no es válido. Solicita uno nuevo desde “¿Olvidaste tu contraseña?”.',
    successTitle: '¡Contraseña actualizada!',
    successMessage: 'Ya puedes iniciar sesión con tu nueva contraseña.',
    errorFallback:
      'No pudimos actualizar tu contraseña. Inténtalo de nuevo en unos minutos.',
    invalidToken:
      'Este enlace no es válido o ya expiró. Solicita un nuevo correo de recuperación.',
    goToLogin: 'Ir a iniciar sesión',
  },
  userActivitiesSection: {
    sectionTitle: 'Mis actividades',
    emptyTitle: 'Tus planes, en un solo lugar',
    emptyBody:
      'Contrata un entrenador para recibir rutina y dieta personalizadas. Cuando te las asigne, las verás aquí.',
    findTrainersButton: 'Ver entrenadores',
    trainerLabel: 'Entrenador:',
  },
  common: {},
};
