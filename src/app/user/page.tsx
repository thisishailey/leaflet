'use client';

import { useAuthContext } from '@/firebase/auth/state';
import AuthButtons from '@/firebase/auth/components/authButtons';
import UserProfile from '@/components/user/userProfile';

export default function Profile() {
    const { user } = useAuthContext();

    return (
        <div>
            <AuthButtons />
            {user?.email && <UserProfile id={user.email} />}
        </div>
    );
}
