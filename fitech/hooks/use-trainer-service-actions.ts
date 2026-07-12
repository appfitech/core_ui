import { type Href, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { showInfoToast } from '@/components/Toast';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import {
  useActivateTrainerService,
  useDeactivateTrainerService,
  useDeleteTrainerService,
} from '@/lib/api/mutations/use-trainer-service-mutations';
import { useUserStore } from '@/stores/user';
import { TrainerService } from '@/types/trainer';

type ServiceAction = 'deactivate' | 'activate' | 'delete';

type Options = {
  onDeleted?: () => void;
};

export function useTrainerServiceActions(options: Options = {}) {
  const { onDeleted } = options;
  const router = useRouter();
  const { showAlert } = useAlert();
  const { common } = TRANSLATIONS;
  const trainerId = useUserStore((s) => s?.user?.user?.id);
  const [pendingServiceId, setPendingServiceId] = useState<number | null>(null);

  const { mutate: deactivateService, isPending: isDeactivating } =
    useDeactivateTrainerService();
  const { mutate: activateService, isPending: isActivating } =
    useActivateTrainerService();
  const { mutate: deleteService, isPending: isDeleting } =
    useDeleteTrainerService();

  const isActionPending =
    isDeactivating || isActivating || isDeleting || pendingServiceId != null;

  const isServicePending = useCallback(
    (serviceId: number) => isActionPending && pendingServiceId === serviceId,
    [isActionPending, pendingServiceId],
  );

  const handleEditService = useCallback(
    (item: TrainerService) => {
      router.push({
        pathname: '/trainer-services/[id]/edit',
        params: {
          id: String(item.id),
          service: JSON.stringify(item),
        },
      });
    },
    [router],
  );

  const runServiceAction = useCallback(
    (
      item: TrainerService,
      action: ServiceAction,
      mutate: typeof deactivateService,
    ) => {
      const resolvedTrainerId = item.trainerId ?? trainerId;
      if (resolvedTrainerId == null) return;

      setPendingServiceId(item.id);
      mutate(
        { serviceId: item.id, trainerId: resolvedTrainerId },
        {
          onSuccess: () => {
            const message =
              action === 'delete'
                ? 'El servicio se eliminó correctamente.'
                : action === 'deactivate'
                  ? 'El servicio se desactivó correctamente.'
                  : 'El servicio se activó correctamente.';
            showInfoToast('Listo', message);
            if (action === 'delete') {
              onDeleted?.();
            }
          },
          onError: (error) => {
            console.error('[FITECH] trainer service action failed', {
              action,
              serviceId: item.id,
              trainerId: item.trainerId ?? trainerId,
              error,
            });
            const apiMessage =
              error instanceof Error && error.message
                ? error.message
                : 'No se pudo completar la acción. Intenta de nuevo.';
            showAlert({
              title: common.errorTitle,
              message: apiMessage,
              buttons: [{ text: common.understood }],
            });
          },
          onSettled: () => {
            setPendingServiceId(null);
          },
        },
      );
    },
    [common.errorTitle, common.understood, onDeleted, showAlert, trainerId],
  );

  const handleDeactivateService = useCallback(
    (item: TrainerService) => {
      showAlert({
        title: 'Desactivar servicio',
        message: `¿Seguro que quieres desactivar "${item.name}"?`,
        buttons: [
          { text: common.cancel, style: 'cancel' },
          {
            text: 'Desactivar',
            style: 'destructive',
            onPress: () =>
              runServiceAction(item, 'deactivate', deactivateService),
          },
        ],
      });
    },
    [common.cancel, deactivateService, runServiceAction, showAlert],
  );

  const handleActivateService = useCallback(
    (item: TrainerService) => {
      showAlert({
        title: 'Activar servicio',
        message: `¿Quieres activar "${item.name}" de nuevo?`,
        buttons: [
          { text: common.cancel, style: 'cancel' },
          {
            text: 'Activar',
            onPress: () => runServiceAction(item, 'activate', activateService),
          },
        ],
      });
    },
    [activateService, common.cancel, runServiceAction, showAlert],
  );

  const handleDeleteService = useCallback(
    (item: TrainerService) => {
      showAlert({
        title: 'Eliminar servicio',
        message: `¿Seguro que quieres eliminar "${item.name}"? Esta acción no se puede deshacer.`,
        buttons: [
          { text: common.cancel, style: 'cancel' },
          {
            text: common.delete,
            style: 'destructive',
            onPress: () => runServiceAction(item, 'delete', deleteService),
          },
        ],
      });
    },
    [common.cancel, common.delete, deleteService, runServiceAction, showAlert],
  );

  const handleToggleStatus = useCallback(
    (item: TrainerService) => {
      if (item.isActive) {
        handleDeactivateService(item);
        return;
      }
      handleActivateService(item);
    },
    [handleActivateService, handleDeactivateService],
  );

  const handleNewService = useCallback(() => {
    router.push('/trainer-services/new' as Href);
  }, [router]);

  return {
    handleEditService,
    handleDeleteService,
    handleToggleStatus,
    handleNewService,
    isServicePending,
  };
}
