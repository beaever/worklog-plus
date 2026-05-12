// exactOptionalPropertyTypes: true 환경에서 Prisma update 데이터 구성 시 undefined 필드 제거
export const omitUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
};
