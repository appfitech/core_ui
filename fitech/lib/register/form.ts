import { PersonDto, UserDtoWritable } from '@/types/api/types.gen';

export function getRegisterFieldValue(
  form: UserDtoWritable,
  field: string,
  isBase?: boolean,
): string | undefined {
  if (isBase) {
    const value = form[field as keyof UserDtoWritable];
    return value != null ? String(value) : undefined;
  }

  const value = form.person?.[field as keyof PersonDto];
  return value != null ? String(value) : undefined;
}

export function validateRegisterStep(
  step: number,
  form: UserDtoWritable,
  options?: { confirmPassword?: string },
): string | null {
  const person = form.person;

  switch (step) {
    case 0:
      if (form.type == null) {
        return 'Selecciona un tipo de cuenta';
      }
      return null;
    case 1:
      if (!person?.documentType) {
        return 'Selecciona un tipo de documento';
      }
      if (!person?.documentNumber?.trim()) {
        return 'Ingresa tu número de documento';
      }
      if (!person?.firstName?.trim()) {
        return 'Ingresa tus nombres';
      }
      if (!person?.lastName?.trim()) {
        return 'Ingresa tus apellidos';
      }
      return null;
    case 2:
      if (!person?.email?.trim()) {
        return 'Ingresa tu correo electrónico';
      }
      if (!person?.phoneNumber?.trim()) {
        return 'Ingresa tu teléfono';
      }
      if (!person?.gender) {
        return 'Selecciona tu género';
      }
      if (!person?.birthDate) {
        return 'Ingresa tu fecha de nacimiento';
      }
      return null;
    case 3:
      if (person?.residenceLocationId == null) {
        return 'Selecciona tu ubicación';
      }
      return null;
    case 4:
      if (!form.username?.trim()) {
        return 'Ingresa un nombre de usuario';
      }
      if (!form.password?.trim()) {
        return 'Ingresa una contraseña';
      }
      if (form.password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
      if (!options?.confirmPassword?.trim()) {
        return 'Confirma tu contraseña';
      }
      if (form.password !== options.confirmPassword) {
        return 'Las contraseñas no coinciden';
      }
      return null;
    default:
      return null;
  }
}
