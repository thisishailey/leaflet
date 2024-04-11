'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useAuthContext } from '@/firebase/auth/state';
import getData from '@/firebase/db/getData';
import addData from '@/firebase/db/addData';
import {
    COLLECTION_POST,
    COLLECTION_USER,
    Data,
    UserData,
} from '@/firebase/db/model';
import uploadFile from '@/firebase/storage/uploadFile';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import UndoIcon from '@mui/icons-material/Undo';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { Typography as TiptapTypography } from '@tiptap/extension-typography';
import getFile from '@/firebase/storage/getFile';

export const WritePost = () => {
    const CHAR_LIMIT = 500;
    const { user } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState<string>('');
    const [complete, setComplete] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const [clickedImage, setClickedImage] = useState<string>('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<File[]>([]);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) {
                return;
            }

            const { result, error } = await getData(
                COLLECTION_USER,
                (user as User).email as string
            );

            if (error) {
                return setAlert('프로필 사진을 불러오지 못했습니다.');
            }

            const userData = result as UserData;
            const imageUrl = userData.profileImg;
            const username = userData.username;

            if (imageUrl) {
                const { result, error } = await getFile(imageUrl);
                if (error) {
                    return setAlert('프로필 사진을 불러오지 못했습니다.');
                }
                setProfileSrc(result as string);
            }

            setUsername(username);
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
            name: '되돌리기',
            command: 'undo',
            icon: <UndoIcon />,
            onclick: () => editor.commands.undo(),
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
        {
            name: '링크',
            command: 'link',
            icon: <InsertLinkIcon />,
            onclick: () => {}, // TODO link upload function
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
    };
    // TODO add photo delete option
    const handleOpenPreview = (url: string) => {
        setClickedImage(url);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (editor.isEmpty) {
            return setAlert('내용을 입력해 주세요.');
        }

        const email = (user as User).email as string;
        const content = editor.getHTML();

        const images: string[] = [];
        if (uploadedImage) {
            for (let i = 0; i < uploadedImage.length; i++) {
                const { error, imageUrl } = await uploadFile(
                    'post',
                    uploadedImage[i]
                );

                if (error) {
                    setAlert(error.message);
                    continue;
                }
                images.push(imageUrl);
            }
        }

        let data: Data = { content, email };
        if (images) {
            data = { ...data, images };
        }

        const { error } = await addData(COLLECTION_POST, data);
        if (error) {
            return setAlert(error.message);
        }

        editor.commands.clearContent();
        setComplete('리프가 업로드 되었어요!');
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
                        sx={{ width: '100%', maxWidth: 900, borderRadius: 4 }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 0, sm: 1 }}
                            width={'100%'}
                            p={1.5}
                        >
                            <Paper
                                variant="outlined"
                                sx={{ width: '100%', borderRadius: 3 }}
                            >
                                <Stack
                                    direction={'row'}
                                    spacing={0.5}
                                    p={0.5}
                                    width={'100%'}
                                >
                                    <Box
                                        id={'editor'}
                                        width={'100%'}
                                        minHeight={100}
                                        p={1}
                                        onClick={() => editor.commands.focus()}
                                    >
                                        {editor?.isEmpty &&
                                            !editor?.isFocused && (
                                                <Box
                                                    component={'span'}
                                                    color={'primary.light'}
                                                    position={'absolute'}
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
                                                <ToggleButtonGroup>
                                                    {formatOptions.map(
                                                        (option) => (
                                                            <ToggleButton
                                                                size="small"
                                                                sx={{
                                                                    bgcolor:
                                                                        'secondary.main',
                                                                    p: 0.5,
                                                                    '&:hover': {
                                                                        bgcolor:
                                                                            'secondary.dark',
                                                                    },
                                                                }}
                                                                key={
                                                                    option.command
                                                                }
                                                                value={
                                                                    option.command
                                                                }
                                                                onClick={
                                                                    option.onclick
                                                                }
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
                                                        )
                                                    )}
                                                </ToggleButtonGroup>
                                            </BubbleMenu>
                                        )}
                                    </Box>
                                    <ToggleButtonGroup
                                        size="small"
                                        orientation={'vertical'}
                                        aria-label="editor tools"
                                    >
                                        {toolOptions.map((option) =>
                                            option.command !== 'image' ? (
                                                <ToggleButton
                                                    key={option.command}
                                                    value={option.command}
                                                    aria-label={option.command}
                                                    onClick={option.onclick}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {option.icon}
                                                </ToggleButton>
                                            ) : (
                                                <ToggleButton
                                                    key={option.command}
                                                    value={option.command}
                                                    aria-label={option.command}
                                                    sx={{ borderRadius: 2 }}
                                                >
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
                                                </ToggleButton>
                                            )
                                        )}
                                    </ToggleButtonGroup>
                                </Stack>
                                <Divider />
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                    p={1}
                                >
                                    <Box
                                        fontSize={'14px'}
                                        display={'flex'}
                                        gap={1}
                                    >
                                        {!imagePreviewUrl
                                            ? '사진 / 링크 프리뷰'
                                            : imagePreviewUrl.map((url) => (
                                                  <Avatar
                                                      key={url}
                                                      src={url}
                                                      variant="rounded"
                                                      sx={{
                                                          width: 40,
                                                          height: 40,
                                                          cursor: 'pointer',
                                                      }}
                                                      onClick={() =>
                                                          handleOpenPreview(url)
                                                      }
                                                  />
                                              ))}
                                    </Box>
                                    <Typography fontSize={'14px'}>
                                        {`${
                                            editor?.storage.characterCount.characters() ||
                                            0
                                        }/${CHAR_LIMIT} 자`}
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Stack
                                direction={'column'}
                                spacing={1}
                                alignItems={{ xs: 'flex-end', sm: 'center' }}
                                justifyContent={'space-between'}
                            >
                                <Avatar
                                    src={profileSrc}
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                    }}
                                >
                                    {username}
                                </Avatar>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ borderRadius: 4.5, fontWeight: 600 }}
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
                                maxWidth: 900,
                                borderRadius: 2,
                                display: alert || complete ? 'flex' : 'none',
                            }}
                        >
                            {complete ? complete : alert}
                        </Alert>
                    </Fade>
                </>
            )}
        </>
    );
};
