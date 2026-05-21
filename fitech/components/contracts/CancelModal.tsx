import { TRANSLATIONS } from '@/constants/strings';

import { ContractConfirmSheet } from './ContractConfirmSheet';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  confirmLoadingLabel?: string;
};

const { cancelContractModal: copy, common } = TRANSLATIONS;

export default function CancelModal({
  isOpen,
  onCloseModal,
  onCancel,
  confirmLoading = false,
  confirmLoadingLabel = common.updating,
}: Props) {
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
      confirmLoading={confirmLoading}
      confirmLoadingLabel={confirmLoadingLabel}
      dismissDisabled={confirmLoading}
    />
  );
}
