import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

export default function useAchievement({
  achievementId,
}: {
  achievementId: string;
}): void {
  const [achieveOne] = useMutation<{
    achievement_id: string;
  }>(
    gql`
      mutation achieveOne($achievement_id: String!) {
        achieveOne(achievement_id: $achievement_id)
      }
    `,
    { variables: { achievement_id: achievementId } }
  );

  achieveOne()
    .then(() => console.log('achieve succes'))
    .catch(() => console.log('achive Settting Error!'));
}
