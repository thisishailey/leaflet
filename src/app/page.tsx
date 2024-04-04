import { Wrapper } from '@/components/common/wrapper';
import { ModeSwicher } from '@/styles/theme';

export default function Home() {
    return (
        <Wrapper>
            <main>{'Home'}</main>
            <ModeSwicher />
        </Wrapper>
    );
}
