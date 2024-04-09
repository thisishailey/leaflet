'use client';

import { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const WYSIWYG = () => {
    const [formats, setFormats] = useState<string[]>([]);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const formatOptions = useMemo(
        () => [
            {
                name: '굵게',
                command: 'bold',
                on: () => setIsBold(true),
                off: () => setIsBold(false),
            },
            {
                name: '기울이기',
                command: 'italic',
                on: () => setIsItalic(true),
                off: () => setIsItalic(false),
            },
            {
                name: '밑줄',
                command: 'underline',
                on: () => setIsUnderline(true),
                off: () => setIsUnderline(false),
            },
        ],
        []
    );

    useEffect(() => {
        formatOptions.forEach((option) => {
            if (formats.includes(option.command)) {
                option.on();
            } else {
                option.off();
            }
        });
    }, [formatOptions, formats]);

    const handleFormat = (
        _event: React.MouseEvent<HTMLElement>,
        newFormats: string[]
    ) => {
        setFormats(newFormats);
    };

    const handleBoldOn = () => {
        const strongElement = document.createElement('strong');
        const userSelection = window.getSelection();
        if (userSelection) {
            console.log(userSelection);
            const selectedTextRange = userSelection.getRangeAt(0);
            selectedTextRange.surroundContents(strongElement);
        } else {
        }
    };

    const helperOptions = [
        { name: '모두선택', command: 'selectAll', onclick: () => {} },
        { name: '이모지', command: 'emoji', onclick: () => {} },
        { name: '사진', command: 'image', onclick: () => {} },
        { name: '링크', command: 'link', onclick: () => {} },
    ];

    return (
        <Box>
            <Stack direction={'row'} p={0.5}>
                <ToggleButtonGroup
                    size="small"
                    value={formats}
                    onChange={handleFormat}
                    aria-label="text formatting"
                >
                    {formatOptions.map((option) => (
                        <ToggleButton
                            key={option.command}
                            value={option.command}
                            aria-label={option.command}
                        >
                            {option.name}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ m: 0.5 }} />
                <ButtonGroup>
                    {helperOptions.map((option) => (
                        <Button
                            key={option.command}
                            aria-label={option.command}
                            onClick={option.onclick}
                        >
                            {option.name}
                        </Button>
                    ))}
                </ButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ m: 0.5 }} />
            </Stack>
            <Paper variant="outlined">
                <Box contentEditable id="wysiwyg-editor" minHeight={100} />
            </Paper>
        </Box>
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
                <Box width={'100%'}>
                    <WYSIWYG />
                </Box>
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
