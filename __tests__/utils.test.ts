// lib/utils.ts의 cn() 헬퍼 함수 테스트

import { cn } from '@/lib/utils';

describe('cn() 유틸리티 함수', () => {
  // 기본 클래스 병합 테스트
  it('단일 클래스를 반환해야 한다', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  // 여러 클래스 병합 테스트
  it('여러 클래스를 공백으로 연결해야 한다', () => {
    expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200');
  });

  // Tailwind 중복 클래스 병합 테스트 (tailwind-merge 동작 확인)
  it('동일 Tailwind 속성의 중복 클래스는 마지막 것으로 덮어써야 한다', () => {
    // text-red-500과 text-blue-500 중 text-blue-500이 이겨야 함
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  // falsy 값 무시 테스트
  it('undefined, null, false 값은 무시해야 한다', () => {
    expect(cn('text-white', undefined, null, false)).toBe('text-white');
  });

  // 조건부 클래스 객체 테스트
  it('조건부 클래스 객체를 올바르게 처리해야 한다', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn({ 'bg-green-500': isActive, 'opacity-50': isDisabled })).toBe('bg-green-500');
  });

  // 배열 클래스 테스트
  it('배열 형태의 클래스를 병합해야 한다', () => {
    expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
  });

  // 빈 입력 테스트
  it('인수가 없으면 빈 문자열을 반환해야 한다', () => {
    expect(cn()).toBe('');
  });

  // padding 클래스 중복 병합 테스트
  it('Tailwind padding 클래스 중복을 올바르게 병합해야 한다', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
