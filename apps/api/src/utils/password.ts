/**
 * 비밀번호 해싱 및 검증 유틸리티
 * 
 * @description
 * - bcrypt를 사용한 안전한 비밀번호 해싱
 * - 비밀번호 검증
 * - Salt rounds: 10 (보안과 성능의 균형)
 */

import bcrypt from 'bcrypt';

/**
 * Salt Rounds
 * 
 * @description
 * - bcrypt 해싱 강도를 결정하는 값
 * - 값이 클수록 보안은 강화되지만 속도는 느려집니다
 * - 10: 약 100ms (권장값)
 * - 12: 약 400ms (더 높은 보안)
 */
const SALT_ROUNDS = 10;

/**
 * 비밀번호 해싱
 * 
 * @description
 * - 평문 비밀번호를 bcrypt로 해싱합니다
 * - 동일한 비밀번호라도 매번 다른 해시값이 생성됩니다 (Salt 사용)
 * - 데이터베이스에는 해시값만 저장합니다
 * 
 * @param {string} password - 평문 비밀번호
 * @returns {Promise<string>} 해싱된 비밀번호
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 * // $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
 * 
 * // 데이터베이스에 저장
 * await prisma.user.create({
 *   data: {
 *     email: 'user@example.com',
 *     passwordHash: hashedPassword,
 *   },
 * });
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error('비밀번호 해싱 실패');
  }
};

/**
 * 비밀번호 검증
 * 
 * @description
 * - 평문 비밀번호와 해시값을 비교합니다
 * - 로그인 시 사용자가 입력한 비밀번호를 확인할 때 사용합니다
 * - 타이밍 공격(timing attack)에 안전합니다
 * 
 * @param {string} password - 평문 비밀번호 (사용자 입력)
 * @param {string} hash - 해싱된 비밀번호 (데이터베이스 저장값)
 * @returns {Promise<boolean>} 일치 여부 (true: 일치, false: 불일치)
 * 
 * @example
 * // 로그인 시 비밀번호 확인
 * const user = await prisma.user.findUnique({
 *   where: { email: 'user@example.com' },
 * });
 * 
 * const isValid = await comparePassword('userInput123', user.passwordHash);
 * if (isValid) {
 *   console.log('로그인 성공');
 * } else {
 *   console.log('비밀번호 불일치');
 * }
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    // 비교 실패 시 false 반환 (보안상 에러를 노출하지 않음)
    return false;
  }
};

/**
 * 비밀번호 강도 검증
 * 
 * @description
 * - 비밀번호가 최소 보안 요구사항을 만족하는지 확인합니다
 * - 최소 8자 이상
 * - 영문자 포함
 * - 숫자 포함
 * - 특수문자 포함 (선택사항)
 * 
 * @param {string} password - 검증할 비밀번호
 * @returns {object} 검증 결과 및 메시지
 * 
 * @example
 * const result = validatePasswordStrength('weak');
 * if (!result.isValid) {
 *   console.log(result.message);
 *   // "비밀번호는 최소 8자 이상이어야 합니다"
 * }
 * 
 * const result2 = validatePasswordStrength('Strong123!@#');
 * if (result2.isValid) {
 *   console.log('강력한 비밀번호입니다');
 * }
 */
export const validatePasswordStrength = (
  password: string,
): { isValid: boolean; message: string } => {
  // 최소 길이 검사
  if (password.length < 8) {
    return {
      isValid: false,
      message: '비밀번호는 최소 8자 이상이어야 합니다',
    };
  }

  // 최대 길이 검사 (DoS 공격 방지)
  if (password.length > 128) {
    return {
      isValid: false,
      message: '비밀번호는 128자를 초과할 수 없습니다',
    };
  }

  // 영문자 포함 검사
  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      message: '비밀번호는 영문자를 포함해야 합니다',
    };
  }

  // 숫자 포함 검사
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: '비밀번호는 숫자를 포함해야 합니다',
    };
  }

  // 특수문자 포함 검사 (선택사항 - 주석 처리)
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return {
  //     isValid: false,
  //     message: '비밀번호는 특수문자를 포함해야 합니다',
  //   };
  // }

  // 모든 검사 통과
  return {
    isValid: true,
    message: '유효한 비밀번호입니다',
  };
};

/**
 * 임시 비밀번호 생성
 * 
 * @description
 * - 비밀번호 찾기 기능에서 사용할 임시 비밀번호를 생성합니다
 * - 영문 대소문자, 숫자, 특수문자를 포함한 12자리 랜덤 문자열
 * 
 * @returns {string} 생성된 임시 비밀번호
 * 
 * @example
 * const tempPassword = generateTemporaryPassword();
 * console.log(tempPassword); // "aB3$xY9@mN2!"
 * 
 * // 이메일로 전송하고 해시하여 저장
 * const hashedPassword = await hashPassword(tempPassword);
 * await prisma.user.update({
 *   where: { email: 'user@example.com' },
 *   data: { passwordHash: hashedPassword },
 * });
 */
export const generateTemporaryPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = '';
  
  // 각 카테고리에서 최소 1개씩 포함
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // 나머지 8자리는 랜덤
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // 문자열 섞기
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};
