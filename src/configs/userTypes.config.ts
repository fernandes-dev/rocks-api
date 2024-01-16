export type validUserTypes = 'administrador' | 'estudante';

export const userTypesConfig: Record<'admin' | 'student', validUserTypes> = {
  admin: 'administrador',
  student: 'estudante',
};
