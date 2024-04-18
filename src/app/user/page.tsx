'use client';

import { useAuthContext } from '@/firebase/auth/state';
import AuthButtons from '@/firebase/auth/components/authButtons';
import UserProfile from '@/components/user/profile';

export default function Profile() {
    const { user } = useAuthContext();

    return (
        <div>
            <AuthButtons />
            {user && <UserProfile email={user.email as string} />}
        </div>
    );
}
