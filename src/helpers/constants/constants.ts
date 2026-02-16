import { DOCUMENT_TYPE } from './document-type';

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const accordionSections = [
  { key: DOCUMENT_TYPE.CERTIFICATES, label: 'Certificates' },
  {
    key: DOCUMENT_TYPE.LEGAL_HEIR_CERTIFICATES,
    label: 'Legal heir certificate',
  },
  { key: DOCUMENT_TYPE.PROOF_OF_OWNERSHIP, label: 'Proof of ownership' },
  { key: DOCUMENT_TYPE.LAB_REPORTS, label: 'Lab Reports' },
  { key: DOCUMENT_TYPE.AWARDS, label: 'Any awards or government certificates' },
  { key: DOCUMENT_TYPE.NOC, label: 'NOC from countries with legal entities' },
  { key: DOCUMENT_TYPE.OTHERS, label: 'Other documents' },
];

export const STRIPE_MAX_PAYMENT_AMOUNT = 999999.98;
export const STRIPE_MIN_PAYMENT_AMOUNT = 0.5;
