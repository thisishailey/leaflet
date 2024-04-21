'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/firebase/auth/state';
import { getData, getProfileSrc } from '@/firebase/db/getData';
import { type UserData, COLLECTION_USER } from '@/firebase/db/model';

import CircularProgress from '@mui/material/CircularProgress';
import CustomAlert from '@/components/common/alert';
import Stack from '@mui/material/Stack';
import UserProfile from '@/components/user/profile';
import UserTabs from '@/components/user/tabs';
import EditProfile from '@/components/user/editProfile';

export default function Profile() {
    const { user, loading } = useAuthContext();

    const [alert, setAlert] = useState<string>('');
    const [userData, setUserData] = useState<
        (UserData & { profileSrc?: string }) | null
    >(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [openFollower, setOpenFollower] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);

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

    const handleOpenEdit = () => setOpenEdit(true);
    const handleOpenFollower = () => setOpenFollower(true);
    const handleOpenFollowing = () => setOpenFollowing(true);

    const handleCloseEdit = () => setOpenEdit(false);
    const handleCloseFollower = () => setOpenFollower(false);
    const handleCloseFollowing = () => setOpenFollowing(false);

    return (
        <>
            <CustomAlert alert={alert} setAlert={setAlert} />
            {loading && (
                <Stack alignItems={'center'} mt={20}>
                    <CircularProgress />
                </Stack>
            )}
            {userData && (
                <>
                    <UserProfile
                        username={userData.username}
                        profileSrc={userData.profileSrc}
                        followerCount={userData.follower?.length || 0}
                        followingCount={userData.following?.length || 0}
                        bio={userData.bio}
                        handlers={{
                            handleOpenEdit,
                            handleOpenFollower,
                            handleOpenFollowing,
                        }}
                    />
                    <UserTabs />
                    <EditProfile
                        open={openEdit}
                        handleClose={handleCloseEdit}
                        userData={{
                            email: userData.email,
                            username: userData.username,
                            firstname: userData.firstname,
                            lastname: userData.lastname,
                            profileSrc: userData.profileSrc,
                            bio: userData.bio,
                        }}
                    />
                </>
            )}
        </>
    );
}

// function SkeletonProfile() {
//     return (
//         <Stack
//             direction={'row'}
//             spacing={{ xs: 2, sm: 4, md: 8 }}
//             width={'100%'}
//             mt={{ xs: 2, md: 4 }}
//             mb={4}
//             px={{ xs: 0, sm: 2, md: 6, lg: 8 }}
//         >
//             <Stack direction={'column'} alignItems={'center'} spacing={1.5}>
//                 <Skeleton
//                     variant="circular"
//                     width={72}
//                     height={72}
//                     sx={{ minWidth: 72 }}
//                 />
//                 <Skeleton variant="rectangular" width={64} height={28} />
//             </Stack>
//             <Stack direction={'column'} spacing={1.5} width={'100%'}>
//                 <Skeleton variant="rectangular" width={220} height={36} />
//                 <Stack direction={'row'} gap={1}>
//                     <Skeleton variant="rectangular" width={106} height={36} />
//                     <Skeleton variant="rectangular" width={106} height={36} />
//                 </Stack>
//                 <Skeleton variant="rectangular" width={'100%'} height={50} />
//             </Stack>
//         </Stack>
//     );
// }
