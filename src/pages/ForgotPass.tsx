import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface ForgotPassProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const ForgotPass: React.FC<ForgotPassProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <Page>
      <TopBar>
        <Brand>
          <BrandIcon aria-hidden="true" className="material-symbols-outlined">auto_awesome</BrandIcon>
          <BrandText>Pictures Talk</BrandText>
        </Brand>
        <Actions>
          <GhostButton type="button">
            <span className="material-symbols-outlined" aria-hidden="true">language</span>
            <span>English</span>
            <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
          </GhostButton>
          <IconButton
            type="button"
            onClick={() => toggleTheme?.()}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </IconButton>
        </Actions>
      </TopBar>

      <Main>
        <Card>
          <CardHeader>
            <h1>Forgot password?</h1>
            <p>Enter your email address and we will send you a link to reset your password.</p>
          </CardHeader>

          <Form>
            <Field>
              <Label htmlFor="email">Email address</Label>
              <InputWrap>
                <InputIcon className="material-symbols-outlined" aria-hidden="true">mail</InputIcon>
                <Input id="email" name="email" placeholder="name@company.com" type="email" />
              </InputWrap>
            </Field>
            <PrimaryButton type="submit">Send reset link</PrimaryButton>
          </Form>

          <HelperRow>
            <Link to="/login">
              <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
              Back to log in
            </Link>
          </HelperRow>
        </Card>
      </Main>

      <Footer>
        <FooterLinks>
          <a href="#">Privacy Policy</a>
          <span />
          <a href="#">Terms of Service</a>
          <span />
          <a href="#">Help Center</a>
        </FooterLinks>
        <FooterNote>(c) 2024 Pictures Talk AI. All rights reserved.</FooterNote>
      </Footer>
    </Page>
  );
};

const Page = styled.div`
  --accent: #f7b025;
  --accent-strong: #e39a1b;
  --navy: #0c2a4a;
  --text: #162234;
  --muted: #5b6777;
  --surface: rgba(255, 255, 255, 0.92);
  --surface-strong: #ffffff;
  --border: rgba(9, 21, 36, 0.08);
  --shadow: 0 26px 65px rgba(15, 40, 68, 0.2);
  min-height: 100vh;
  padding: 32px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background:
    radial-gradient(circle at 12% 8%, rgba(247, 176, 37, 0.24), transparent 52%),
    radial-gradient(circle at 86% 18%, rgba(33, 119, 196, 0.16), transparent 45%),
    linear-gradient(180deg, #f7f6f2 0%, #f1f5fb 100%);
  color: var(--text);
  font-family: 'Inter', 'Prompt', sans-serif;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    opacity: 0.18;
    pointer-events: none;
    animation: float 9s ease-in-out infinite;
  }

  &::before {
    width: 420px;
    height: 420px;
    background: #ffcd6b;
    top: -200px;
    right: -140px;
  }

  &::after {
    width: 320px;
    height: 320px;
    background: #2b6cb0;
    bottom: -160px;
    left: -120px;
    animation-delay: 1.5s;
  }

  @keyframes float {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, 18px, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  html.dark & {
    --text: #f5f7fa;
    --muted: #b4bcc8;
    --surface: rgba(20, 26, 38, 0.92);
    --surface-strong: #151b27;
    --border: rgba(255, 255, 255, 0.08);
    --shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    background:
      radial-gradient(circle at 12% 8%, rgba(247, 176, 37, 0.2), transparent 52%),
      radial-gradient(circle at 86% 18%, rgba(77, 122, 182, 0.22), transparent 45%),
      linear-gradient(180deg, #0b1016 0%, #121b29 100%);
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  gap: 20px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--accent);
  color: #0d2340;
  font-size: 24px;
`;

const BrandText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.02em;

  html.dark & {
    color: #f5f7fa;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--accent-strong);
    transform: translateY(-1px);
    border-color: rgba(247, 176, 37, 0.4);
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--accent-strong);
    border-color: rgba(247, 176, 37, 0.4);
    transform: translateY(-1px);
  }

  html.dark & {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.section`
  width: min(520px, 100%);
  background: var(--surface);
  border-radius: 28px;
  border: 1px solid var(--border);
  padding: 48px 44px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 28px;

  @media (max-width: 640px) {
    padding: 36px 28px;
  }
`;

const CardHeader = styled.div`
  h1 {
    margin: 0 0 12px;
    font-size: 32px;
    color: var(--navy);
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: var(--muted);
    line-height: 1.6;
    font-size: 15px;
  }

  html.dark & h1 {
    color: #f5f7fa;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const Field = styled.div`
  display: grid;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);

  html.dark & {
    color: #f5f7fa;
  }
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 0 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: rgba(247, 176, 37, 0.6);
    box-shadow: 0 0 0 4px rgba(247, 176, 37, 0.16);
  }

  html.dark & {
    background: rgba(15, 20, 30, 0.7);
  }
`;

const InputIcon = styled.span`
  color: var(--muted);
  font-size: 20px;
  margin-right: 8px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  padding: 14px 0;
  font-size: 15px;
  color: var(--text);
  outline: none;

  &::placeholder {
    color: rgba(90, 100, 112, 0.6);
  }

  html.dark &::placeholder {
    color: rgba(197, 206, 219, 0.55);
  }
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 16px;
  padding: 14px 18px;
  background: var(--accent);
  color: #0c243f;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(247, 176, 37, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    background: var(--accent-strong);
    transform: translateY(-1px);
    box-shadow: 0 16px 32px rgba(247, 176, 37, 0.4);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: center;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--accent-strong);
  }

  html.dark & a {
    color: var(--accent);
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--accent-strong);
  }

  span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: rgba(90, 100, 112, 0.25);
  }
`;

const FooterNote = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(90, 100, 112, 0.5);
`;

export default ForgotPass;
