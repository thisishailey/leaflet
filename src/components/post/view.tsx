import { PostPreview } from './post';

export default function ViewPost() {
    const posts = [
        {
            id: 1,
            username: 'leaflet',
            content:
                '도서 중심의 소셜 미디어 플랫폼, Leaflet(리플렛). 다양한 형태의 잎들이 서로 연결되고, 성장하는 모습처럼 플랫폼 사용자들이 서로 지식을 공유하고 확장해나가기를 꿈꿉니다.',
        },
        {
            id: 2,
            username: 'leaflet',
            content:
                '도서 중심의 소셜 미디어 플랫폼, Leaflet(리플렛). 다양한 형태의 잎들이 서로 연결되고, 성장하는 모습처럼 플랫폼 사용자들이 서로 지식을 공유하고 확장해나가기를 꿈꿉니다.',
        },
    ];
	
    return (
        <>
            {posts.map((post) => (
                <PostPreview
                    username={post.username}
                    content={post.content}
                    key={post.id}
                />
            ))}
        </>
    );
}
