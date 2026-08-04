import { describe, it, expect } from 'vitest';
import { quoteFilterValue } from '../use-projects';

describe('quoteFilterValue', () => {
  it('값을 큰따옴표로 감싼다', () => {
    expect(quoteFilterValue('%검색어%')).toBe('"%검색어%"');
  });

  it('콤마를 인용부호 안에 가둬 or() 조건 주입을 막는다', () => {
    // 이 입력을 그대로 넣으면 `name.ilike.` 조건이 하나 더 붙어 전체 행이 매칭된다.
    const injection = '%zzzz,name.ilike.%';
    expect(quoteFilterValue(injection)).toBe('"%zzzz,name.ilike.%"');
  });

  it('큰따옴표와 백슬래시를 이스케이프해 인용을 탈출하지 못하게 한다', () => {
    expect(quoteFilterValue('a"b')).toBe('"a\\"b"');
    expect(quoteFilterValue('a\\b')).toBe('"a\\\\b"');
    // 인용을 닫고 조건을 덧붙이려는 시도
    expect(quoteFilterValue('x",name.ilike."')).toBe('"x\\",name.ilike.\\""');
  });
});
