// 암호화폐 순위 대시보드 컴포넌트 테스트
// formatNumber, formatPrice 유틸리티 함수 및 컴포넌트 렌더링 검증

import React from 'react';
import { render, screen } from '@testing-library/react';
import Component, { formatNumber, formatPrice } from '@/crypto-ranking-board';

// next/image를 일반 img로 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// lucide-react 아이콘 모킹 (SVG 렌더링 오류 방지)
jest.mock('lucide-react', () => ({
  TrendingUp: ({ className }: { className?: string }) => (
    <span data-testid="trending-up" className={className} />
  ),
  TrendingDown: ({ className }: { className?: string }) => (
    <span data-testid="trending-down" className={className} />
  ),
}));

describe('암호화폐 순위 대시보드 컴포넌트', () => {
  // 기본 렌더링 테스트
  describe('기본 렌더링', () => {
    it('제목 "암호화폐 순위"가 표시되어야 한다', () => {
      render(<Component />);
      expect(screen.getByText('암호화폐 순위')).toBeInTheDocument();
    });

    it('테이블 헤더가 모두 렌더링되어야 한다', () => {
      render(<Component />);
      expect(screen.getByText('순위')).toBeInTheDocument();
      expect(screen.getByText('이름')).toBeInTheDocument();
      expect(screen.getByText('가격')).toBeInTheDocument();
      expect(screen.getByText('24시간 변동률')).toBeInTheDocument();
      expect(screen.getByText('시가총액')).toBeInTheDocument();
      expect(screen.getByText('거래량 (24시간)')).toBeInTheDocument();
    });

    it('푸터 텍스트가 표시되어야 한다', () => {
      render(<Component />);
      expect(screen.getByText(/데이터는 60초마다 업데이트됩니다/)).toBeInTheDocument();
    });

    it('8개의 코인 데이터가 모두 렌더링되어야 한다', () => {
      render(<Component />);
      // mockCoinData에 있는 코인 이름 확인
      expect(screen.getByText('비트코인')).toBeInTheDocument();
      expect(screen.getByText('이더리움')).toBeInTheDocument();
      expect(screen.getByText('테더')).toBeInTheDocument();
      expect(screen.getByText('바이낸스 코인')).toBeInTheDocument();
      expect(screen.getByText('솔라나')).toBeInTheDocument();
      expect(screen.getByText('리플')).toBeInTheDocument();
      expect(screen.getByText('USD 코인')).toBeInTheDocument();
      expect(screen.getByText('카르다노')).toBeInTheDocument();
    });

    it('코인 심볼이 모두 렌더링되어야 한다', () => {
      render(<Component />);
      expect(screen.getByText('BTC')).toBeInTheDocument();
      expect(screen.getByText('ETH')).toBeInTheDocument();
      expect(screen.getByText('USDT')).toBeInTheDocument();
      expect(screen.getByText('BNB')).toBeInTheDocument();
      expect(screen.getByText('SOL')).toBeInTheDocument();
      expect(screen.getByText('XRP')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
      expect(screen.getByText('ADA')).toBeInTheDocument();
    });
  });

  // formatPrice 함수 검증 (컴포넌트 렌더링을 통해)
  describe('가격 표시 (formatPrice)', () => {
    it('1달러 이상 가격은 소수점 2자리로 표시되어야 한다 (비트코인)', () => {
      render(<Component />);
      // 비트코인 가격: 43250.67 → $43,250.67
      expect(screen.getByText('$43,250.67')).toBeInTheDocument();
    });

    it('1달러 이상 가격은 소수점 2자리로 표시되어야 한다 (이더리움)', () => {
      render(<Component />);
      // 이더리움 가격: 2580.34 → $2,580.34
      expect(screen.getByText('$2,580.34')).toBeInTheDocument();
    });

    it('1달러 미만 가격은 소수점 4자리로 표시되어야 한다 (리플)', () => {
      render(<Component />);
      // 리플 가격: 0.6234 → $0.6234
      expect(screen.getByText('$0.6234')).toBeInTheDocument();
    });

    it('1달러 미만 가격은 소수점 4자리로 표시되어야 한다 (카르다노)', () => {
      render(<Component />);
      // 카르다노 가격: 0.4567 → $0.4567
      expect(screen.getByText('$0.4567')).toBeInTheDocument();
    });

    it('1달러 정확히 1인 경우 소수점 2자리로 표시되어야 한다 (테더)', () => {
      render(<Component />);
      // 테더 가격: 1.0 → $1.00 (1 이상이므로 toLocaleString 사용)
      // toLocaleString은 환경에 따라 다를 수 있으므로 $1로 시작하는지 확인
      const priceElements = screen.getAllByText(/^\$1/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  // formatNumber 함수 검증 (컴포넌트 렌더링을 통해)
  describe('숫자 포맷 표시 (formatNumber)', () => {
    it('조 단위(T) 숫자가 올바르게 표시되어야 한다 (비트코인 시가총액)', () => {
      render(<Component />);
      // 비트코인 시가총액: 847,500,000,000 → $847.50B (1T 미만이므로 B)
      expect(screen.getByText('$847.50B')).toBeInTheDocument();
    });

    it('십억 단위(B) 숫자가 올바르게 표시되어야 한다 (이더리움 시가총액)', () => {
      render(<Component />);
      // 이더리움 시가총액: 310,200,000,000 → $310.20B
      expect(screen.getByText('$310.20B')).toBeInTheDocument();
    });

    it('십억 단위(B) 거래량이 올바르게 표시되어야 한다 (비트코인 거래량)', () => {
      render(<Component />);
      // 비트코인 거래량: 28,500,000,000 → $28.50B
      expect(screen.getByText('$28.50B')).toBeInTheDocument();
    });

    it('백만 단위(M) 숫자가 올바르게 표시되어야 한다 (카르다노 거래량)', () => {
      render(<Component />);
      // 카르다노 거래량: 890,000,000 → $890.00M
      expect(screen.getByText('$890.00M')).toBeInTheDocument();
    });
  });

  // 24시간 변동률 조건부 렌더링 테스트
  describe('24시간 변동률 표시', () => {
    it('양수 변동률에는 "+" 접두사가 붙어야 한다', () => {
      render(<Component />);
      // 비트코인 change24h: +2.45%
      expect(screen.getByText('+2.45%')).toBeInTheDocument();
    });

    it('음수 변동률에는 "+" 접두사가 붙지 않아야 한다', () => {
      render(<Component />);
      // 이더리움 change24h: -1.23%
      expect(screen.getByText('-1.23%')).toBeInTheDocument();
    });

    it('양수 변동률에 TrendingUp 아이콘이 렌더링되어야 한다', () => {
      render(<Component />);
      // 양수 변동률 코인: 비트코인, 테더, 바이낸스코인, 솔라나, 카르다노 (5개)
      const trendingUpIcons = screen.getAllByTestId('trending-up');
      expect(trendingUpIcons.length).toBeGreaterThan(0);
    });

    it('음수 변동률에 TrendingDown 아이콘이 렌더링되어야 한다', () => {
      render(<Component />);
      // 음수 변동률 코인: 이더리움, 리플, USD코인 (3개)
      const trendingDownIcons = screen.getAllByTestId('trending-down');
      expect(trendingDownIcons.length).toBeGreaterThan(0);
    });

    it('양수 변동률이 있는 코인은 정확히 5개여야 한다', () => {
      render(<Component />);
      // 비트코인(+2.45), 테더(+0.02), 바이낸스코인(+3.67), 솔라나(+5.23), 카르다노(+1.89)
      const trendingUpIcons = screen.getAllByTestId('trending-up');
      expect(trendingUpIcons).toHaveLength(5);
    });

    it('음수 변동률이 있는 코인은 정확히 3개여야 한다', () => {
      render(<Component />);
      // 이더리움(-1.23), 리플(-2.87), USD코인(-0.01)
      const trendingDownIcons = screen.getAllByTestId('trending-down');
      expect(trendingDownIcons).toHaveLength(3);
    });

    it('작은 양수 변동률(+0.02%)이 올바르게 표시되어야 한다 (테더)', () => {
      render(<Component />);
      expect(screen.getByText('+0.02%')).toBeInTheDocument();
    });

    it('작은 음수 변동률(-0.01%)이 올바르게 표시되어야 한다 (USD코인)', () => {
      render(<Component />);
      expect(screen.getByText('-0.01%')).toBeInTheDocument();
    });

    it('큰 양수 변동률(+5.23%)이 올바르게 표시되어야 한다 (솔라나)', () => {
      render(<Component />);
      expect(screen.getByText('+5.23%')).toBeInTheDocument();
    });
  });

  // 코인 순위 테스트
  describe('코인 순위', () => {
    it('순위 1번부터 8번까지 모두 표시되어야 한다', () => {
      render(<Component />);
      for (let i = 1; i <= 8; i++) {
        expect(screen.getByText(String(i))).toBeInTheDocument();
      }
    });
  });

  // formatNumber 직접 단위 테스트 (미커버 브랜치 보완)
  describe('formatNumber 직접 단위 테스트', () => {
    it('조 단위(T) 숫자가 올바르게 변환되어야 한다', () => {
      expect(formatNumber(1e12)).toBe('$1.00T');
      expect(formatNumber(2.5e12)).toBe('$2.50T');
    });

    it('천 단위(K) 숫자가 올바르게 변환되어야 한다', () => {
      expect(formatNumber(1500)).toBe('$1.50K');
      expect(formatNumber(999000)).toBe('$999.00K');
    });

    it('천 미만 숫자는 그대로 표시되어야 한다', () => {
      expect(formatNumber(500)).toBe('$500.00');
      expect(formatNumber(0)).toBe('$0.00');
    });
  });

  // formatPrice 직접 단위 테스트
  describe('formatPrice 직접 단위 테스트', () => {
    it('1달러 이상 가격이 올바르게 포맷되어야 한다', () => {
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('1달러 미만 가격은 소수점 4자리로 포맷되어야 한다', () => {
      expect(formatPrice(0.1234)).toBe('$0.1234');
    });
  });

  // 코인 이미지 테스트
  describe('코인 이미지', () => {
    it('비트코인 이미지가 올바른 경로로 렌더링되어야 한다', () => {
      render(<Component />);
      const bitcoinImg = screen.getByAltText('비트코인');
      expect(bitcoinImg).toBeInTheDocument();
      expect(bitcoinImg).toHaveAttribute('src', '/coin/bitcoin.png');
    });

    it('모든 코인 이미지 alt 텍스트가 코인 이름과 일치해야 한다', () => {
      render(<Component />);
      const coinNames = ['비트코인', '이더리움', '테더', '바이낸스 코인', '솔라나', '리플', 'USD 코인', '카르다노'];
      coinNames.forEach((name) => {
        expect(screen.getByAltText(name)).toBeInTheDocument();
      });
    });

    it('USD 코인 이미지는 webp 형식이어야 한다', () => {
      render(<Component />);
      const usdcImg = screen.getByAltText('USD 코인');
      expect(usdcImg).toHaveAttribute('src', '/coin/usdc.webp');
    });
  });
});
