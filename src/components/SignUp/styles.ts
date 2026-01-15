import styled from 'styled-components';

export const Page = styled.div`
  --accent: #f7b025;
  --accent-strong: #e39a1b;
  --navy: #0c2a4a;
  --text: #162234;
  --muted: #546170;
  --surface: rgba(255, 255, 255, 0.92);
  --surface-strong: #ffffff;
  --border: rgba(9, 21, 36, 0.08);
  --shadow: 0 24px 60px rgba(15, 40, 68, 0.18);
  min-height: 100vh;
  padding: 32px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background:
    radial-gradient(circle at 10% 0%, rgba(247, 176, 37, 0.25), transparent 50%),
    radial-gradient(circle at 90% 20%, rgba(27, 99, 171, 0.16), transparent 45%),
    linear-gradient(180deg, #f7f6f2 0%, #f2f6fb 100%);
  color: var(--text);
  font-family: 'Inter', 'Prompt', sans-serif;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    opacity: 0.2;
    pointer-events: none;
  }

  &::before {
    width: 420px;
    height: 420px;
    background: #ffcd6b;
    top: -200px;
    right: -120px;
  }

  &::after {
    width: 320px;
    height: 320px;
    background: #2b6cb0;
    bottom: -160px;
    left: -120px;
  }

  html.dark & {
    --text: #f5f7fa;
    --muted: #b4bcc8;
    --surface: rgba(20, 26, 38, 0.92);
    --surface-strong: #151b27;
    --border: rgba(255, 255, 255, 0.08);
    --shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    background:
      radial-gradient(circle at 10% 0%, rgba(247, 176, 37, 0.25), transparent 50%),
      radial-gradient(circle at 90% 20%, rgba(77, 122, 182, 0.22), transparent 45%),
      linear-gradient(180deg, #0b1016 0%, #111926 100%);
  }
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 1;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
`;

export const BrandIcon = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--accent);
  color: var(--navy);
  display: grid;
  place-items: center;
  font-size: 22px;
  box-shadow: 0 12px 24px rgba(247, 176, 37, 0.35);
`;

export const BrandText = styled.span`
  color: var(--navy);

  html.dark & {
    color: var(--text);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const GhostButton = styled.button`
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 14px;
  background: var(--surface);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  span:first-child {
    font-size: 18px;
  }

  &:hover {
    transform: translateY(-1px);
    color: var(--text);
  }
`;

export const IconButton = styled.button`
  border: 1px solid var(--border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface);
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  span {
    font-size: 20px;
  }

  &:hover {
    transform: translateY(-1px);
    color: var(--text);
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Card = styled.section`
  width: min(560px, 100%);
  background: var(--surface);
  border-radius: 28px;
  padding: 36px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);

  @media (max-width: 640px) {
    padding: 28px 22px;
  }
`;

export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;

  h1 {
    font-size: 32px;
    margin: 0 0 10px;
    color: var(--navy);
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
  }

  html.dark & h1 {
    color: var(--text);
  }
`;

export const Divider = styled.div`
  position: relative;
  margin: 26px 0;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;

  &::before {
    content: '';
    position: absolute;
    inset: 50% 0 auto 0;
    height: 1px;
    background: var(--border);
  }

  span {
    position: relative;
    padding: 0 16px;
    background: var(--surface);
  }
`;

export const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SocialButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  padding: 14px 16px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease, background 0.2s ease;

  img {
    width: 22px;
    height: 22px;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(247, 176, 37, 0.5);
    background: rgba(247, 176, 37, 0.06);
  }
`;

export const AltLink = styled.div`
  margin-top: 22px;
  text-align: center;
  font-size: 14px;
  color: var(--muted);

  a {
    color: var(--navy);
    font-weight: 700;
    text-decoration: none;
    margin-left: 6px;
  }

  a:hover {
    text-decoration: underline;
  }

  html.dark & a {
    color: var(--accent);
  }
`;

export const Footer = styled.footer`
  text-align: center;
  display: grid;
  gap: 16px;
  color: var(--muted);
  font-size: 12px;
  z-index: 1;
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;

  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--border);
  }

  a {
    color: inherit;
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    color: var(--text);
  }
`;

export const FooterNote = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;
