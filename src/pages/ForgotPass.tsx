import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import Header from '../components/Common/Header';

type ClerkError = {
  errors?: Array<{ message?: string; longMessage?: string; code?: string }>;
};

type SignInFactor = {
  strategy?: string;
  emailAddressId?: string;
};

const getClerkError = (error: unknown, fallback: string) => {
  const firstError =
    typeof error === 'object' &&
    error &&
    'errors' in error &&
    Array.isArray((error as ClerkError).errors)
      ? (error as ClerkError).errors?.[0]
      : null;

  return {
    code: firstError?.code,
    message: firstError?.longMessage || firstError?.message || fallback,
  };
};

interface ForgotPassProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ForgotPass: React.FC<ForgotPassProps> = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailAddressId, setEmailAddressId] = useState<string | null>(null);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      navigate('/home');
    }
  }, [isAuthLoaded, isSignedIn, navigate]);

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLoaded || !signIn) return;

    setIsSubmitting(true);
    try {
      const signInAttempt = await signIn.create({ identifier: email.trim() });
      const factors = (signInAttempt.supportedFirstFactors || []) as SignInFactor[];
      const emailFactor = factors.find((factor) => factor.strategy === 'reset_password_email_code')
        || factors.find((factor) => factor.emailAddressId);

      if (!emailFactor?.emailAddressId) {
        setError('Unable to locate email address for reset. Please try again.');
        return;
      }

      setEmailAddressId(emailFactor.emailAddressId);
      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        emailAddressId: emailFactor.emailAddressId,
      });
      setStep('reset');
      setInfo('We sent a verification code to your email.');
    } catch (err: unknown) {
      const { message } = getClerkError(err, 'Unable to send reset email. Please try again.');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    if (newPassword.trim().length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }

    if (!isLoaded || !signIn) return;

    setIsSubmitting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword.trim(),
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        navigate('/home');
        return;
      }

      setError('Reset requires additional steps. Please try again.');
    } catch (err: unknown) {
      const { message } = getClerkError(err, 'Unable to reset password. Please try again.');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <Main>
        <Card>
          <CardHeader>
            <h1>Forgot password?</h1>
            <p>
              {step === 'request'
                ? 'Enter your email address and we will send you a verification code.'
                : 'Enter the code from your email and choose a new password.'}
            </p>
          </CardHeader>

          {step === 'request' ? (
            <Form onSubmit={handleRequestReset} noValidate>
              <Field>
                <Label htmlFor="email">Email address</Label>
                <InputWrap>
                  <InputIcon className="material-symbols-outlined" aria-hidden="true">mail</InputIcon>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </InputWrap>
              </Field>

              {error && <ErrorText role="alert">{error}</ErrorText>}
              {info && <InfoText role="status">{info}</InfoText>}

              <PrimaryButton type="submit" disabled={!isLoaded || isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset code'}
              </PrimaryButton>
            </Form>
          ) : (
            <Form onSubmit={handleResetPassword} noValidate>
              <Field>
                <Label htmlFor="code">Verification code</Label>
                <InputWrap>
                  <InputIcon className="material-symbols-outlined" aria-hidden="true">pin</InputIcon>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Enter the code"
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </InputWrap>
              </Field>

              <Field>
                <Label htmlFor="newPassword">New password</Label>
                <InputWrap>
                  <InputIcon className="material-symbols-outlined" aria-hidden="true">lock</InputIcon>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="********"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </InputWrap>
              </Field>

              <Field>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <InputWrap>
                  <InputIcon className="material-symbols-outlined" aria-hidden="true">lock</InputIcon>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </InputWrap>
              </Field>

              {error && <ErrorText role="alert">{error}</ErrorText>}
              {info && <InfoText role="status">{info}</InfoText>}

              <PrimaryButton type="submit" disabled={!isLoaded || isSubmitting || !emailAddressId}>
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </PrimaryButton>

              <InlineLink type="button" onClick={() => setStep('request')}>
                Use a different email
              </InlineLink>
            </Form>
          )}

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
  padding: 0 0 48px;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const InlineLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--accent-strong);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  justify-self: center;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #d14343;
  font-weight: 600;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
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
