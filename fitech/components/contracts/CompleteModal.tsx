import { TRANSLATIONS } from '@/constants/strings';

import { ContractConfirmSheet } from './ContractConfirmSheet';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onComplete: () => void;
  confirmLoading?: boolean;
  confirmLoadingLabel?: string;
};

const { completeContractModal: copy, common } = TRANSLATIONS;

export default function CompleteModal({
  isOpen,
  onCloseModal,
  onComplete,
  confirmLoading = false,
  confirmLoadingLabel = common.updating,
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
      confirmLoading={confirmLoading}
      confirmLoadingLabel={confirmLoadingLabel}
      dismissDisabled={confirmLoading}
    />
  );
}
