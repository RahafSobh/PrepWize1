/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleLogin } from '@react-oauth/google';
import { UserProfile } from '../types';

interface GoogleSignInButtonProps {
  onAuthSuccess: (profile: UserProfile) => void;
  onError: (message: string) => void;
  mockProfile: UserProfile;
}

export default function GoogleSignInButton({
  onAuthSuccess,
  onError,
  mockProfile,
}: GoogleSignInButtonProps) {
  return (
    <div id="google-sign-in-btn" className="flex-1 flex justify-center">
      <GoogleLogin
        text="signin_with"
        shape="rectangular"
        theme="outline"
        size="medium"
        onSuccess={async (response) => {
          if (!response.credential) {
            onError('Google sign-in did not return a credential.');
            return;
          }

          try {
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ credential: response.credential }),
            });

            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              onError(body.error || 'Google sign-in failed.');
              return;
            }

            const googleProfile = (await res.json()) as UserProfile;
            onAuthSuccess({
              ...googleProfile,
              plan: mockProfile.plan || 'Free',
              simulationsCompleted: mockProfile.simulationsCompleted || 0,
              role: mockProfile.role || 'Full Stack',
              streakCount: mockProfile.streakCount || 1,
            });
          } catch {
            onError('Unable to reach the authentication server.');
          }
        }}
        onError={() => onError('Google sign-in was cancelled or failed.')}
      />
    </div>
  );
}
