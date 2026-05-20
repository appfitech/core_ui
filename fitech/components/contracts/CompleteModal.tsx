import { TRANSLATIONS } from '@/constants/strings';

import { ContractConfirmSheet } from './ContractConfirmSheet';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onComplete: () => void;
};

const { completeContractModal: copy } = TRANSLATIONS;

export default function CompleteModal({
  isOpen,
  onCloseModal,
  onComplete,
}: Props) {
  return (
    <ContractConfirmSheet
      visible={isOpen}
      onClose={onCloseModal}
      onConfirm={onComplete}
      title={copy.title}
      intro={copy.intro}
      bullets={copy.bullets}
      warning={copy.warning}
      dismissLabel={copy.dismiss}
      confirmLabel={copy.confirm}
      confirmVariant="primary"
    />
  );
}
