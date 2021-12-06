import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

export default function useAchievement({
  achievementId,
}: {
  achievementId: string;
}): void {
  const [achieveOne, { error }] = useMutation<{
    achievement_id: string;
  }>(
    gql`
      mutation achieveOne {
        achieveOne
      }
    `,
    { variables: { achievement_id: achievementId } }
  );

  achieveOne().catch(() => console.log('achive Settting Error!'));
}
