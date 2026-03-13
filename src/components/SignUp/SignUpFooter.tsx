import React from 'react';
import { Footer, FooterLinks, FooterNote } from './styles';
import { useLanguage } from '../../LanguageContext';

const SignUpFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Footer>
      <FooterLinks>
        <a href="#">{t('privacy')}</a>
        <span />
        <a href="#">{t('terms')}</a>
        <span />
        <a href="#">{t('help')}</a>
      </FooterLinks>
      <FooterNote>{t('footer_note')}</FooterNote>
    </Footer>
  );
};

export default SignUpFooter;
