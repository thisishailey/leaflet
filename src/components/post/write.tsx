'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/firebase/auth/state';
import { type UserBasic, getUserProfile } from '@/firebase/db/getData';
import addData from '@/firebase/db/addData';
import uploadFile from '@/firebase/storage/uploadFile';
import { type PostData, COLLECTION_POST } from '@/firebase/db/model';
import { POST_IMAGES } from '@/firebase/storage/directory';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SignInBanner from '../common/signinBanner';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import RedoIcon from '@mui/icons-material/Redo';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import UndoIcon from '@mui/icons-material/Undo';

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { Typography as TiptapTypography } from '@tiptap/extension-typography';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

export default function WritePost() {
    const CHAR_LIMIT = 500;
    const { user, loading } = useAuthContext();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const [alert, setAlert] = useState<string>('');
    const [complete, setComplete] = useState<string>('');
    const [open, setOpen] = useState(false);

    const [profile, setProfile] = useState<UserBasic>();
    const [clickedImage, setClickedImage] = useState<string>('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<File[]>([]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadProfile = async () => {
            const result = await getUserProfile(user.email as string);

            if (result.error) {
                return setAlert('프로필 사진을 불러오지 못했습니다.');
            }

            setProfile(result.data as UserBasic);
        };

        loadProfile();
    }, [user]);

    const editor = useEditor({
        content: '',
        extensions: [
            StarterKit,
            TiptapTypography,
            CharacterCount.configure({
                limit: CHAR_LIMIT,
            }),
        ],
    }) as Editor;

    const formatOptions = [
        {
            name: '굵게',
            command: 'bold',
            icon: <FormatBoldIcon />,
            onclick: () => editor.chain().focus().toggleBold().run(),
        },
        {
            name: '기울임',
            command: 'italic',
            icon: <FormatItalicIcon />,
            onclick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            name: '효과 제거',
            command: 'clear',
            icon: <FormatClearIcon />,
            onclick: () => editor.commands.unsetAllMarks(),
        },
    ];
    const toolOptions = [
        {
            name: '실행취소',
            command: 'undo',
            icon: <UndoIcon />,
            onclick: () => editor.commands.undo(),
        },
        {
            name: '다시실행',
            command: 'redo',
            icon: <RedoIcon />,
            onclick: () => editor.commands.redo(),
        },
        {
            name: '모두선택',
            command: 'selectAll',
            icon: <SelectAllIcon />,
            onclick: () => editor.commands.focus('all'),
        },
        {
            name: '사진',
            command: 'image',
            icon: <InsertPhotoIcon />,
        },
    ];

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const image = files[0];
            setUploadedImage(uploadedImage.concat(image));

            const url = URL.createObjectURL(image);
            setImagePreviewUrl(imagePreviewUrl.concat(url));
        }
        setMenuAnchor(null);
    };

    const handleOpenPreview = (url: string) => {
        setClickedImage(url);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (editor.isEmpty && uploadedImage.length === 0) {
            return setAlert('내용을 입력해 주세요.');
        }

        if (!user || !user.email) {
            return setAlert(
                '유저 정보가 올바르지 않습니다. 재로그인 후 다시 시도해 주세요.'
            );
        }

        const email = user.email;
        const content = editor.getHTML();

        const images: string[] = [];
        if (uploadedImage) {
            for (let i = 0; i < uploadedImage.length; i++) {
                const { error, imageUrl } = await uploadFile(
                    POST_IMAGES,
                    uploadedImage[i]
                );

                if (error) {
                    setAlert(
                        `이미지 파일 '${uploadedImage[i].name}'을 업로드하지 못했습니다.`
                    );
                    continue;
                }

                images.push(imageUrl);
            }
        }

        let data: PostData = { content, email };
        if (images) {
            data = { ...data, images };
        }

        const { error } = await addData(COLLECTION_POST, data);
        if (error) {
            return setAlert('리프를 업로드하지 못했습니다.');
        }

        setComplete('리프가 업로드 되었어요!');
        editor.commands.clearContent();
        setUploadedImage([]);
        setImagePreviewUrl([]);
        setClickedImage('');
        setOpen(false);
    };

    return (
        <>
            {user && (
                <>
                    <Backdrop
                        open={open}
                        onClick={() => setOpen(false)}
                        sx={{ zIndex: 9999, mt: '0 !important' }}
                    >
                        <Avatar
                            variant="square"
                            src={clickedImage}
                            sx={{ width: { xs: 300, md: 500 }, height: 'auto' }}
                        />
                    </Backdrop>
                    <Paper
                        variant="outlined"
                        sx={{ width: '100%', maxWidth: 976 }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1, sm: 2 }}
                            width={'100%'}
                            p={{ xs: 1, sm: 2 }}
                        >
                            <Stack direction={'column'} width={'100%'}>
                                <Box
                                    id={'editor'}
                                    width={'100%'}
                                    minHeight={100}
                                    height={'100%'}
                                    p={1}
                                    onClick={() => editor.commands.focus()}
                                >
                                    {editor?.isEmpty && !editor?.isFocused && (
                                        <Box
                                            component={'span'}
                                            position={'absolute'}
                                            color={'primary.light'}
                                        >
                                            {'리프를 작성해 보세요 🌿'}
                                        </Box>
                                    )}
                                    <EditorContent editor={editor} />
                                    {editor && (
                                        <BubbleMenu
                                            editor={editor}
                                            tippyOptions={{ duration: 100 }}
                                        >
                                            <ToggleButtonGroup aria-label="text formatting">
                                                {formatOptions.map((option) => (
                                                    <ToggleButton
                                                        sx={{
                                                            p: 1,
                                                            bgcolor:
                                                                'secondary.main',
                                                            '&:hover': {
                                                                bgcolor:
                                                                    'secondary.dark',
                                                            },
                                                        }}
                                                        key={option.command}
                                                        value={option.command}
                                                        onClick={option.onclick}
                                                        className={
                                                            editor.isActive(
                                                                option.command
                                                            )
                                                                ? 'is-active'
                                                                : ''
                                                        }
                                                    >
                                                        {option.icon}
                                                    </ToggleButton>
                                                ))}
                                            </ToggleButtonGroup>
                                        </BubbleMenu>
                                    )}
                                </Box>
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >
                                    <Stack direction={'row'}>
                                        {imagePreviewUrl.length === 0 ? (
                                            <Typography
                                                ml={{ xs: 0, sm: 1 }}
                                                fontSize={'14px'}
                                            >
                                                {
                                                    '더하기 버튼으로 사진을 추가해 보세요!'
                                                }
                                            </Typography>
                                        ) : (
                                            imagePreviewUrl.map((url) => (
                                                <Avatar
                                                    key={url}
                                                    src={url}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        mx: 0.5,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        handleOpenPreview(url)
                                                    }
                                                />
                                            ))
                                        )}
                                    </Stack>
                                    <Typography fontSize={'14px'}>
                                        {`${
                                            editor?.storage.characterCount.characters() ||
                                            0
                                        } / ${CHAR_LIMIT} 자`}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack
                                direction={{ xs: 'row', sm: 'column' }}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                gap={1}
                            >
                                <Avatar
                                    src={profile?.profileSrc}
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                    }}
                                >
                                    {profile?.username.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Button
                                        id="editor-button"
                                        variant="outlined"
                                        aria-controls={
                                            Boolean(menuAnchor)
                                                ? 'editor-menu'
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            Boolean(menuAnchor)
                                                ? 'true'
                                                : undefined
                                        }
                                        onClick={(
                                            event: React.MouseEvent<HTMLButtonElement>
                                        ) => setMenuAnchor(event.currentTarget)}
                                    >
                                        <AddIcon />
                                    </Button>
                                    <Menu
                                        id="editor-menu"
                                        anchorEl={menuAnchor}
                                        open={Boolean(menuAnchor)}
                                        onClose={() => setMenuAnchor(null)}
                                        MenuListProps={{
                                            'aria-labelledby': 'editor-button',
                                            disablePadding: true,
                                            sx: {
                                                display: 'flex',
                                                p: 0.25,
                                            },
                                        }}
                                        anchorOrigin={{
                                            vertical: 'center',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
                                        }}
                                    >
                                        {toolOptions.map((option) => (
                                            <Tooltip
                                                title={option.name}
                                                placement="top"
                                                key={option.command}
                                            >
                                                <MenuItem
                                                    value={option.command}
                                                    aria-label={option.command}
                                                    disableGutters
                                                    sx={{ p: 1 }}
                                                    onClick={() => {
                                                        if (option.onclick) {
                                                            option.onclick();
                                                            setMenuAnchor(null);
                                                        }
                                                    }}
                                                >
                                                    {option.command !==
                                                    'image' ? (
                                                        option.icon
                                                    ) : (
                                                        <Box
                                                            component={'label'}
                                                            htmlFor="image"
                                                            width={24}
                                                            height={24}
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {option.icon}
                                                            <input
                                                                id="image"
                                                                name="image"
                                                                type="file"
                                                                accept="image/*"
                                                                hidden
                                                                onChange={
                                                                    handleImage
                                                                }
                                                            />
                                                        </Box>
                                                    )}
                                                </MenuItem>
                                            </Tooltip>
                                        ))}
                                    </Menu>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ fontWeight: 600 }}
                                >
                                    {'리프'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                    <Fade
                        in={alert !== '' || complete !== ''}
                        addEndListener={() =>
                            setTimeout(() => {
                                setAlert('');
                                setComplete('');
                            }, 4000)
                        }
                    >
                        <Alert
                            severity={complete ? 'success' : 'error'}
                            sx={{
                                width: '100%',
                                maxWidth: 976,
                                display: alert || complete ? 'flex' : 'none',
                            }}
                        >
                            {complete ? complete : alert}
                        </Alert>
                    </Fade>
                </>
            )}
            {!loading && !user && (
                <SignInBanner nextAction={'하고 리프를 작성해 보세요!'} />
            )}
        </>
    );
}
