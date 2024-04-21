import Skeleton from '@mui/material/Skeleton';

export default function SkeletonPreviews() {
    return (
        <>
            <Skeleton variant="rectangular" width={'100%'} height={125} />
            <Skeleton variant="rectangular" width={'100%'} height={125} />
            <Skeleton variant="rectangular" width={'100%'} height={125} />
            <Skeleton variant="rectangular" width={'100%'} height={125} />
        </>
    );
}
