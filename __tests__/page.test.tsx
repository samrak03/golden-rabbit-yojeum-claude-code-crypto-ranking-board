// app/page.tsx 렌더링 테스트

import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

// next/image 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// lucide-react 아이콘 모킹
jest.mock('lucide-react', () => ({
  TrendingUp: ({ className }: { className?: string }) => (
    <span data-testid="trending-up" className={className} />
  ),
  TrendingDown: ({ className }: { className?: string }) => (
    <span data-testid="trending-down" className={className} />
  ),
}));

describe('페이지 컴포넌트', () => {
  it('페이지가 렌더링되고 암호화폐 순위 제목이 표시되어야 한다', () => {
    render(<Page />);
    expect(screen.getByText('암호화폐 순위')).toBeInTheDocument();
  });
});
