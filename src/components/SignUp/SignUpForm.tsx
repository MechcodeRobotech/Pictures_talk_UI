import React, { useState } from 'react';
import styled from 'styled-components';

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form>
      <Field>
        <Label htmlFor="name">Full Name</Label>
        <InputWrap>
          <InputIcon className="material-symbols-outlined" aria-hidden="true">person</InputIcon>
          <Input id="name" name="name" placeholder="John Doe" type="text" />
        </InputWrap>
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <InputWrap>
          <InputIcon className="material-symbols-outlined" aria-hidden="true">mail</InputIcon>
          <Input id="email" name="email" placeholder="name@company.com" type="email" />
        </InputWrap>
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
      </Field>

      <TermsRow>
        <input id="terms" type="checkbox" />
        <label htmlFor="terms">
          I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </label>
      </TermsRow>

      <PrimaryButton type="submit">Sign up</PrimaryButton>
    </Form>
  );
};

const Form = styled.form`
  display: grid;
  gap: 18px;
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

const Input = styled.input`
  width: 100%;
  padding: 14px 44px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  color: var(--text);
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(247, 176, 37, 0.6);
    box-shadow: 0 0 0 3px rgba(247, 176, 37, 0.2);
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
`;

export default SignUpForm;
