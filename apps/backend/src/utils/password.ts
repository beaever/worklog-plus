import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch {
    throw new Error('비밀번호 해싱 실패');
  }
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
};

export const verifyPassword = comparePassword;

export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다' };
  if (password.length > 128) return { isValid: false, message: '비밀번호는 128자를 초과할 수 없습니다' };
  if (!/[a-zA-Z]/.test(password)) return { isValid: false, message: '비밀번호는 영문자를 포함해야 합니다' };
  if (!/\d/.test(password)) return { isValid: false, message: '비밀번호는 숫자를 포함해야 합니다' };
  return { isValid: true, message: '유효한 비밀번호입니다' };
};

export const generateTemporaryPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};
