'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/firebase/auth/state';
import { getData, getProfileSrc } from '@/firebase/db/getData';
import { COLLECTION_USER, type UserData } from '@/firebase/db/model';

import AuthButtons from '@/firebase/auth/components/authButtons';
import CustomAlert from '@/components/common/alert';
import UserProfile from '@/components/user/profile';
import UserTabs from '@/components/user/tabs';

export default function Profile() {
    const { user, loading } = useAuthContext();

    const [alert, setAlert] = useState<string>('');
    const [userData, setUserData] = useState<
        (UserData & { profileSrc?: string }) | null
    >(null);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            return setUserData(null);
        }

        const loadUser = async () => {
            const { result, error } = await getData(
                COLLECTION_USER,
                user.email as string
            );

            if (error) {
                return setAlert('프로필 정보를 불러오지 못했습니다.');
            }

            const userData = result as UserData;

            if (userData.profileImg) {
                const src = await getProfileSrc(userData.profileImg);
                if (src) {
                    return setUserData({ ...userData, profileSrc: src });
                }
            }

            return setUserData(userData);
        };

        loadUser();
    }, [user, loading]);

    return (
        <>
            <CustomAlert alert={alert} setAlert={setAlert} />
            {userData && (
                <>
                    <UserProfile
                        username={userData.username}
                        profileSrc={userData.profileSrc}
                        followerCount={userData.follower?.length || 0}
                        followingCount={userData.following?.length || 0}
                        bio={userData.bio}
                    />
                    <UserTabs />
                </>
            )}
            {!loading && !userData && <AuthButtons />}
        </>
    );
}
