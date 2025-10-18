import React from 'react';

import { useResetMatchList } from '../api/mutations/matches/use-reset-match-list';
import { useSendTestNotification } from '../api/mutations/test/use-send-test-notification';
import { Button } from '../components/Button';
import PageContainer from '../components/PageContainer';

export default function Register() {
  const { mutate: sendTestNotification } = useSendTestNotification();
  const { mutate: resetMatchList } = useResetMatchList();

  async function sendTestPush() {
    sendTestNotification();
  }

  return (
    <PageContainer header={'Testing tools'} style={{ padding: 16, rowGap: 16 }}>
      <Button label={'Clear matches'} onPress={resetMatchList} />
      <Button label={'Test notification'} onPress={sendTestPush} />
    </PageContainer>
  );
}
