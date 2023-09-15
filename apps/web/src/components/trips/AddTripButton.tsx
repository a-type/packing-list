import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';

export interface AddTripButtonProps {}

export function AddTripButton({}: AddTripButtonProps) {
  const client = hooks.useClient();
  return (
    <Button
      color="primary"
      onClick={() => {
        client.trips.put({});
      }}
    >
      New trip
    </Button>
  );
}
