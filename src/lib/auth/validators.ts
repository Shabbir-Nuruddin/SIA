// Student emails: any domain containing "sia" or "scholars"
// e.g. name@sia.com, name@siastudents.com, name@scholarsinternationalacademy.com
// Teachers and parents: any email is accepted (validated in Auth.tsx by role)

export function isStudentEmail(email: string): boolean {
  const domain = (email.toLowerCase().trim().split('@')[1] ?? '');
  return domain.includes('sia') || domain.includes('scholars');
}

export type UserRole = 'student' | 'teacher' | 'parent';
