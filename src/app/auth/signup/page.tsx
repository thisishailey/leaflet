import Link from 'next/link';
import Button from '@mui/material/Button';

export default function SignUp() {
    return (
        <div>
            <Link href="/auth/signin">
                <Button>Sign In</Button>
            </Link>
        </div>
    );
}
