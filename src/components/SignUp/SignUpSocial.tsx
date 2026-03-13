import React from 'react';
import { Link } from 'react-router-dom';
import { AltLink, Divider, SocialButton, SocialGrid } from './styles';
import { useLanguage } from '../../LanguageContext';

const SignUpSocial: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Divider>
        <span>{t('or_continue')}</span>
      </Divider>

      <SocialGrid>
        <SocialButton type="button">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
          />
          <span>Google</span>
        </SocialButton>
        <SocialButton type="button">
          <img
            src="https://www.facebook.com/images/fb_icon_325x325.png"
            alt="Facebook"
          />
          <span>Facebook</span>
        </SocialButton>
        <SocialButton type="button">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
            alt="LINE"
          />
          <span>LINE</span>
        </SocialButton>
      </SocialGrid>

      <AltLink>
        {t('signup_have_account')} <Link to="/login">{t('signup_login')}</Link>
      </AltLink>
    </>
  );
};

export default SignUpSocial;
