import React from 'react';

import { LegalWebViewPage } from '@/components/LegalWebViewPage';
import { LEGAL_URLS } from '@/constants/legal';
import { TRANSLATIONS } from '@/constants/strings';

export default function TermsAndConditionsScreen() {
  const { legalDocuments: copy } = TRANSLATIONS;

  return (
    <LegalWebViewPage
      title={copy.termsTitle}
      url={LEGAL_URLS.termsAndConditions}
    />
  );
}
