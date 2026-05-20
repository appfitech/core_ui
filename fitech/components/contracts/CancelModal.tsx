import { TRANSLATIONS } from '@/constants/strings';

import { ContractConfirmSheet } from './ContractConfirmSheet';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
};

const { cancelContractModal: copy } = TRANSLATIONS;

export default function CancelModal({ isOpen, onCloseModal, onCancel }: Props) {
  return (
    <ContractConfirmSheet
      visible={isOpen}
      onClose={onCloseModal}
      onConfirm={onCancel}
      title={copy.title}
      intro={copy.intro}
      bullets={copy.bullets}
      warning={copy.warning}
      dismissLabel={copy.dismiss}
      confirmLabel={copy.confirm}
      confirmVariant="destructive"
    />
  );
}
