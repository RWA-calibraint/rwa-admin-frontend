// Constants
import { ASSET_MODAL_TYPE } from '@helpers/constants/asset.status';
import { DOCUMENT_MODAL_TYPE } from '@helpers/constants/document-type';
import { USER_STATUS } from '@helpers/constants/user-account-status';

// Interfaces
import { ModalContent } from './interface';

export const modalContent: ModalContent = {
  pending: {
    [ASSET_MODAL_TYPE.APPROVE]: {
      heading: 'Approve Asset',
      description:
        'Are you sure you want to approve this asset? The asset will be listed on the marketplace and visible to buyers.',
    },
    [ASSET_MODAL_TYPE.HOLD]: {
      heading: 'Hold Asset',
      description:
        'Are you sure you want to Hold this asset? We will not list this asset on the marketplace, we will only mark it as Hold for further verification.',
    },
    [ASSET_MODAL_TYPE.RELEASE]: {
      heading: 'Release Asset',
      description: 'Are you sure you want to Release this asset?',
    },
    [ASSET_MODAL_TYPE.REJECT]: {
      heading: 'Reject Asset',
      description: (name: string) => `Are you sure you want to Reject <b className="f-14-20-500-primary">${name}</b>`,
    },
    [ASSET_MODAL_TYPE.LIST]: {
      heading: 'List Asset',
      description:
        'Are you sure you want to list this asset? The asset will be listed on the marketplace and visible to buyers.',
    },
    [ASSET_MODAL_TYPE.DELETE]: {
      heading: 'Delete Asset',
      description: `Are you sure you want to delete this asset from the list? The asset will not be shown on the marketplace..`,
    },
  },
  approved: {
    [ASSET_MODAL_TYPE.APPROVE]: {
      heading: 'Delist Asset',
      description: 'Are you sure you want to delist this asset? The asset will not be shown on the marketplace.',
    },
    [ASSET_MODAL_TYPE.DELIST]: {
      heading: 'Delist Asset',
      description: 'Are you sure you want to delist this asset? The asset will not be shown on the marketplace.',
    },
    [ASSET_MODAL_TYPE.REJECT]: {
      heading: 'Delete Asset',
      description: (name) => `Are you sure you want to Delete <b className="f-14-20-500-primary">${name}</b>.`,
    },
    [ASSET_MODAL_TYPE.DELETE]: {
      heading: 'Delete Asset',
      description: `Are you sure you want to delete this asset from the list? The asset will not be shown on the marketplace.`,
    },
    [ASSET_MODAL_TYPE.HOLD]: {
      heading: 'Hold Asset',
      description:
        'Are you sure you want to Hold this asset? We will not list this asset on the marketplace, we will only mark it as Hold for further verification.',
    },
  },
  rejected: {
    [ASSET_MODAL_TYPE.APPROVE]: {
      heading: 'Block resubmission',
      description: (name) =>
        `Are you sure you want to block <b className="f-14-20-500-primary">${name}</b> from resubmitting assets? The blocked user cannot resubmit asset details.`,
    },
    [ASSET_MODAL_TYPE.DELETE]: {
      heading: 'Delete Asset',
      description: `Are you sure you want to delete this asset from the list? The asset will not be shown on the marketplace.`,
    },
    [ASSET_MODAL_TYPE.REJECT]: {
      heading: 'Delete Asset',
      description: `Are you sure you want to Reject this asset from the list? The asset will not be shown on the marketplace.`,
    },
  },
  users: {
    [USER_STATUS.SUSPENDED]: {
      heading: 'Suspend User',
      showBlockDate: true,
      description: (name: string) =>
        `<p class="f-14-20-400-tertiary">Are you sure you want to suspend <span class="f-14-20-600-primary">${name}</span>? The suspended user cannot access the marketplace during the suspension period.</p>`,
    },
    [USER_STATUS.TERMINATED]: {
      heading: 'Terminate User',
      description: (name: string) =>
        `<p class="f-14-20-400-tertiary">Are you sure you want to block <span class="f-14-20-600-primary">${name}</span>? The blocked user cannot access the marketplace.</p>`,
    },
    [USER_STATUS.ACTIVE]: {
      heading: 'Activate User',
      description: (name: string) =>
        `<p class="f-14-20-400-tertiary">Are you sure you want to activate this <span class="f-14-20-600-primary">${name}</span>? This user will become active and will be able to access the marketplace.</p>`,
    },
  },
  transactions: {
    approve: {
      heading: 'Refund',
      description: (name) => `Are you sure you want to refund <b className="f-14-20-500-primary">${name}</b>?`,
    },
  },
  assets: {
    [ASSET_MODAL_TYPE.HOLD]: {
      heading: 'Hold Asset',
      description:
        'Are you sure you want to Hold this asset? We will not list this asset on the marketplace, we will only mark it as Hold for further verification.',
    },
    [ASSET_MODAL_TYPE.REJECT]: {
      heading: 'Reject Asset',
      description: 'Are you sure you want to reject this asset? Explain why this asset was rejected.',
    },
    [ASSET_MODAL_TYPE.APPROVE]: {
      heading: 'Approve Asset',
      description:
        'Are you sure you want to approve this asset? The asset will be listed on the marketplace and visible to buyers.',
    },
    [ASSET_MODAL_TYPE.TOKENS]: {
      heading: 'Issue Tokens',
      description:
        'Specify the number of tokens to fractionalize this asset. The asset will be divided, and buyers will be able to purchase fractions.',
    },
    [ASSET_MODAL_TYPE.DELIST]: {
      heading: 'Delist Asset',
      description: 'Are you sure you want to delist this asset? The asset will not be shown on the marketplace.',
    },
    [ASSET_MODAL_TYPE.LIST]: {
      heading: 'List Asset',
      description:
        'Are you sure you want to list this asset? The asset will be listed on the marketplace and visible to buyers.',
    },
    [ASSET_MODAL_TYPE.DELETE]: {
      heading: 'Delete Asset',
      description:
        'Are you sure you want to delete this asset from the list? The asset will not be shown on the marketplace.',
    },
  },
  documents: {
    [DOCUMENT_MODAL_TYPE.REMOVE]: {
      heading: 'Remove Approval',
      description: 'Are you sure you want to remove approval for this document?',
    },
    [DOCUMENT_MODAL_TYPE.REJECT]: {
      heading: 'Reject Document',
      description: 'Are you sure you want to reject this document? Explain why this asset was rejected.',
    },
    [DOCUMENT_MODAL_TYPE.APPROVE]: {
      heading: 'Approve Document',
      description: 'Are you sure you want to approve this document? ',
    },
  },
};
