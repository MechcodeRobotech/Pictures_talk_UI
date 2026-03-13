import React from 'react';
import {
  Card,
  CardHeader,
  Content,
  Main,
  Page,
  SignUpFooter,
  SignUpForm,
  SignUpSocial,
} from '../components/SignUp';
import Header from '../components/Common/Header';
import { useLanguage } from '../LanguageContext';

interface SignUpProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ isDarkMode, toggleTheme }) => {
  const { t } = useLanguage();

  return (
    <Page>
      <Header isDarkMode={!!isDarkMode} toggleTheme={toggleTheme ?? (() => {})} />

      <Content>
        <Main>
          <Card>
            <CardHeader>
              <span className="app-kicker">{t('signup_title')}</span>
              <h1>{t('signup_title')}</h1>
              <p>{t('signup_desc')}</p>
            </CardHeader>

            <SignUpForm />
            <SignUpSocial />
          </Card>
        </Main>

        <SignUpFooter />
      </Content>
    </Page>
  );
};

export default SignUp;
