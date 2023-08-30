import { OAuthSignInButton } from '@/components/auth/OAuthSigninButton.jsx';
import { useSearchParams } from '@verdant-web/react-router';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
  const [params] = useSearchParams();

  let returnTo = params.get('returnTo') || undefined;

  return (
    <div>
      <h1>Join</h1>
      <div>
        <OAuthSignInButton provider="google" returnTo={returnTo}>
          Sign up with Google
        </OAuthSignInButton>
      </div>
    </div>
  );
}

export default JoinPage;
