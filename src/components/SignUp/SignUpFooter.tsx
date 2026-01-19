import React from 'react';
import { Footer, FooterLinks, FooterNote } from './styles';

const SignUpFooter: React.FC = () => (
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
);

export default SignUpFooter;
