import React from 'react';
import { Link } from 'react-router-dom';
import { AltLink, Divider, SocialButton, SocialGrid } from './styles';

const SignUpSocial: React.FC = () => (
  <>
    <Divider>
      <span>Or continue with</span>
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
      Already have an account? <Link to="/login">Log in</Link>
    </AltLink>
  </>
);

export default SignUpSocial;
