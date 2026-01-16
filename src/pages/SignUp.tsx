import React from 'react';
import {
  Card,
  CardHeader,
  Main,
  Page,
  SignUpFooter,
  SignUpForm,
  SignUpSocial,
} from '../components/SignUp';
import Header from '../components/Common/Header';

interface SignUpProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ isDarkMode, toggleTheme }) => (
  <Page>
    <Header isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} />

    <Main>
      <Card>
        <CardHeader>
          <h1>Create your account</h1>
          <p>Enter your details to start generating AI summaries from your pictures.</p>
        </CardHeader>

        <SignUpForm />
        <SignUpSocial />
      </Card>
    </Main>

    <SignUpFooter />
  </Page>
);

export default SignUp;
