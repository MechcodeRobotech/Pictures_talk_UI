import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth, useSignUp } from '@clerk/clerk-react';

type ClerkError = {
  errors?: Array<{ message?: string; longMessage?: string; code?: string }>;
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

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: false,
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      navigate('/home');
    }
  }, [isAuthLoaded, isSignedIn, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setAuthError(null);
    setIsEmailTaken(false);
    if (touched[name] || hasSubmitted) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: checked }));
    setAuthError(null);
    setIsEmailTaken(false);
    if (touched[name] || hasSubmitted) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formValues.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!formValues.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email.';
    }
    if (!formValues.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formValues.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (!formValues.terms) nextErrors.terms = 'Please accept the terms to continue.';

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (!isLoaded || !signUp) return;

    setErrors({});
    setAuthError(null);
    setIsEmailTaken(false);
    setIsSubmitting(true);

    try {
      const result = await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        navigate('/home');
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (error: unknown) {
      const { message, code } = getClerkError(error, 'Unable to sign up. Please try again.');
      setIsEmailTaken(code === 'form_identifier_exists' || message.toLowerCase().includes('taken'));
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        navigate('/home');
        return;
      }

      setAuthError('Verification requires additional steps. Please try again.');
    } catch (error: unknown) {
      const { message } = getClerkError(error, 'Invalid verification code. Please try again.');
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowError = (field: string) => (hasSubmitted || touched[field]) && Boolean(errors[field]);
  const isFormComplete = Object.keys(validate()).length === 0;
  const isVerificationReady = verificationCode.trim().length > 0;
  const isBusy = isSubmitting;

  if (step === 'verify') {
    return (
      <Form onSubmit={handleVerifySubmit} noValidate>
        <Field>
          <Label htmlFor="verificationCode">Verification code</Label>
          <InputWrap>
            <InputIcon className="material-symbols-outlined" aria-hidden="true">mail</InputIcon>
            <Input
              id="verificationCode"
              name="verificationCode"
              placeholder="Enter the code from your email"
              type="text"
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value);
                setAuthError(null);
              }}
              aria-invalid={Boolean(authError)}
            />
          </InputWrap>
        </Field>

        {authError && <ErrorText role="alert">{authError}</ErrorText>}

        <PrimaryButton type="submit" disabled={!isLoaded || isBusy || !isVerificationReady}>
          {isSubmitting ? 'Verifying...' : 'Verify email'}
        </PrimaryButton>
      </Form>
    );
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <NameRow>
        <Field>
          <Label htmlFor="firstName">First Name</Label>
          <InputWrap>
            <InputIcon className="material-symbols-outlined" aria-hidden="true">person</InputIcon>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              type="text"
              value={formValues.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              $hasError={shouldShowError('firstName')}
              aria-invalid={shouldShowError('firstName')}
              aria-describedby={shouldShowError('firstName') ? 'firstName-error' : undefined}
            />
          </InputWrap>
          {shouldShowError('firstName') && <ErrorText id="firstName-error">{errors.firstName}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="lastName">Last Name</Label>
          <InputWrap>
            <InputIcon className="material-symbols-outlined" aria-hidden="true">person</InputIcon>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              type="text"
              value={formValues.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              $hasError={shouldShowError('lastName')}
              aria-invalid={shouldShowError('lastName')}
              aria-describedby={shouldShowError('lastName') ? 'lastName-error' : undefined}
            />
          </InputWrap>
          {shouldShowError('lastName') && <ErrorText id="lastName-error">{errors.lastName}</ErrorText>}
        </Field>
      </NameRow>

      <Field>
        <Label htmlFor="email">Email</Label>
        <InputWrap>
          <InputIcon className="material-symbols-outlined" aria-hidden="true">mail</InputIcon>
          <Input
            id="email"
            name="email"
            placeholder="name@company.com"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            $hasError={shouldShowError('email')}
            aria-invalid={shouldShowError('email')}
            aria-describedby={shouldShowError('email') ? 'email-error' : undefined}
          />
        </InputWrap>
        {shouldShowError('email') && <ErrorText id="email-error">{errors.email}</ErrorText>}
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <InputWrap>
          <InputIcon className="material-symbols-outlined" aria-hidden="true">lock</InputIcon>
          <Input
            id="password"
            name="password"
            placeholder="********"
            type={showPassword ? 'text' : 'password'}
            value={formValues.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            $hasError={shouldShowError('password')}
            aria-invalid={shouldShowError('password')}
            aria-describedby={shouldShowError('password') ? 'password-error' : undefined}
          />
          <InputButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </InputButton>
        </InputWrap>
        {shouldShowError('password') && <ErrorText id="password-error">{errors.password}</ErrorText>}
      </Field>

      <TermsBlock>
        <TermsRow>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formValues.terms}
            onChange={handleCheckboxChange}
            onBlur={handleBlur}
            aria-invalid={shouldShowError('terms')}
            aria-describedby={shouldShowError('terms') ? 'terms-error' : undefined}
          />
          <label htmlFor="terms">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </label>
        </TermsRow>
        {shouldShowError('terms') && <ErrorText id="terms-error">{errors.terms}</ErrorText>}
      </TermsBlock>

      {authError && (
        <>
          <ErrorText role="alert">{authError}</ErrorText>
          {isEmailTaken && (
            <HelperActions>
              <span>Already have an account?</span>
              <Link to="/login">Log in</Link>
              <Link to="/forgot-pass">Forgot password?</Link>
            </HelperActions>
          )}
        </>
      )}

      <PrimaryButton type="submit" disabled={!isLoaded || isBusy || !isFormComplete}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </PrimaryButton>
    </Form>
  );
};

const Form = styled.form`
  display: grid;
  gap: 18px;
`;

const NameRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

const Field = styled.div`
  display: grid;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);

  html.dark & {
    color: var(--text);
  }
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  color: var(--muted);
  font-size: 20px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 44px;
  border-radius: 14px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#d14343' : 'var(--border)')};
  background: var(--surface-strong);
  color: var(--text);
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#d14343' : 'rgba(247, 176, 37, 0.6)')};
    box-shadow: ${({ $hasError }) =>
      $hasError ? '0 0 0 3px rgba(209, 67, 67, 0.2)' : '0 0 0 3px rgba(247, 176, 37, 0.2)'};
  }

  &::placeholder {
    color: #9aa4b2;
  }
`;

const InputButton = styled.button`
  position: absolute;
  right: 12px;
  border: none;
  background: transparent;
  color: var(--muted);
  display: grid;
  place-items: center;
  cursor: pointer;

  span {
    font-size: 20px;
  }

  &:hover {
    color: var(--text);
  }
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #d14343;
  font-weight: 600;
`;

const HelperActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: var(--muted);

  a {
    color: var(--accent);
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const TermsBlock = styled.div`
  display: grid;
  gap: 8px;
`;

const TermsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: var(--muted);

  input {
    margin-top: 2px;
    accent-color: var(--accent);
  }

  a {
    color: var(--navy);
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  html.dark & a {
    color: var(--text);
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 14px;
  background: var(--accent);
  color: var(--navy);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(247, 176, 37, 0.35);
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: var(--accent-strong);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #c7ccd6;
    color: #6b7280;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &:disabled:hover {
    background: #c7ccd6;
    transform: none;
  }
`;

export default SignUpForm;
