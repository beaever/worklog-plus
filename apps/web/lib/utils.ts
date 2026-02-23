/**
 * UUID v4 생성 함수
 * 1순위: crypto.randomUUID() (가장 안전하고 표준)
 * 2순위: crypto.getRandomValues() (암호학적으로 안전)
 * 3순위: Math.random() (최후의 폴백, 보안에 민감하지 않은 경우만)
 */
export function generateUUID(): string {
  // 1순위: crypto.randomUUID() 사용
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // 2순위: crypto.getRandomValues를 사용한 UUID v4 생성
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // UUID v4 형식으로 변환
    const byte6 = bytes[6];
    const byte8 = bytes[8];
    if (byte6 !== undefined && byte8 !== undefined) {
      bytes[6] = (byte6 & 0x0f) | 0x40; // version 4
      bytes[8] = (byte8 & 0x3f) | 0x80; // variant
    }

    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // 3순위 (최후의 폴백): Math.random() 사용
  // 주의: 암호학적으로 안전하지 않으므로 보안에 민감한 용도로는 사용 금지
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
