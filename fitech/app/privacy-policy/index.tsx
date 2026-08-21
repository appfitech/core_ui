import React from 'react';

import { LegalWebViewPage } from '@/components/LegalWebViewPage';
import { LEGAL_URLS } from '@/constants/legal';
import { TRANSLATIONS } from '@/constants/strings';

export default function PrivacyPolicyScreen() {
  const { legalDocuments: copy } = TRANSLATIONS;

  return (
    <LegalWebViewPage title={copy.privacyTitle} url={LEGAL_URLS.privacyPolicy} />
  );
}
