'use client';

import { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';

const Tiptap = () => {
    const editor = useEditor({
        content: '',
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: '리프를 작성해 보세요!🌿' }),
			Typography
        ],
    });

    return <EditorContent editor={editor} width={'100%'} />;
};

const Editor = () => {
    const [formats, setFormats] = useState<string[]>([]);
    const [isEditor, setIsEditor] = useState<boolean>(false);

    const formatOptions = useMemo(
        () => [
            {
                name: '굵게',
                command: 'bold',
                tag: 'strong',
                icon: <FormatBoldIcon />,
            },
            {
                name: '기울이기',
                command: 'italic',
                tag: 'em',
                icon: <FormatItalicIcon />,
            },
            {
                name: '밑줄',
                command: 'underline',
                tag: 'u',
                icon: <FormatUnderlinedIcon />,
            },
        ],
        []
    );

    document.addEventListener('selectionchange', (event: Event) => {
        const editor = document.querySelector('#wysiwyg-editor');
        if ((event.target as Document).activeElement === editor) {
            setIsEditor(true);
        } else {
            setIsEditor(false);
        }
    });

    useEffect(() => {
        const selection = document.getSelection();
        const selectedFormat = formatOptions.filter((option) =>
            formats.includes(option.command)
        );

        if (selection) {
            if (!isEditor) {
                return;
            }

            const selectedText = selection.getRangeAt(0);
            console.log(selectedText);
            const element = document.createElement(selectedFormat[0].tag);
            selectedText.surroundContents(element);
        }
    }, [formatOptions, formats, isEditor]);

    const handleFormat = (
        _event: React.MouseEvent<HTMLElement>,
        newFormats: string[]
    ) => {
        setFormats(newFormats);
    };

    const toolOptions = [
        {
            name: '모두선택',
            command: 'selectAll',
            onclick: () => {},
            icon: <SelectAllIcon />,
        },
        {
            name: '이모지',
            command: 'emoji',
            onclick: () => {},
            icon: <InsertEmoticonIcon />,
        },
        {
            name: '사진',
            command: 'image',
            onclick: () => {},
            icon: <InsertPhotoIcon />,
        },
        {
            name: '링크',
            command: 'link',
            onclick: () => {},
            icon: <InsertLinkIcon />,
        },
    ];

    return (
        <Paper variant="outlined" sx={{ width: '100%' }}>
            <Stack direction={'row'} p={0.5} width={'100%'}>
                {/* <Box
                    contentEditable
                    id="wysiwyg-editor"
                    width={'100%'}
                    minHeight={100}
                /> */}
                <Tiptap />
                <ToggleButtonGroup
                    size="small"
                    orientation="vertical"
                    aria-label="editor tools"
                >
                    {toolOptions.map((option) => (
                        <ToggleButton
                            key={option.command}
                            value={option.command}
                            aria-label={option.command}
                            onClick={option.onclick}
                        >
                            {option.icon}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>
            <Divider />
            <Box p={1}>{'사진 / 링크 프리뷰'}</Box>
        </Paper>
    );
};

export const WritePost = () => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        console.log(value);
        setValue('');
    };

    return (
        <Paper variant="outlined" sx={{ width: '100%', maxWidth: 900 }}>
            <Stack direction={'row'} spacing={2} width={'100%'} p={1}>
                <Editor />
                <Stack
                    direction={'column'}
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Box>
                        <Avatar />
                    </Box>
                    <Box>
                        <Button variant="contained" onClick={handleSubmit}>
                            {'리프'}
                        </Button>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
};
