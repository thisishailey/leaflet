'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { setFocus, removeFocus, emptyValue, getValue } from '@/util/util';

interface SearchPostValue {
    value: string;
    hashtag: JSX.Element;
}

export const SearchPost = () => {
    const [searchValue, setSearchValue] = useState<SearchPostValue[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isMax, setIsMax] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const placeholderText = '읽고 싶은 키워드를 검색해 보세요.';
    const errorHelperText = '검색할 키워드를 1개 이상 입력해 주세요.';
    const maxHelperText = '최대 3개까지 입력할 수 있어요.';

    useEffect(() => {
        if (searchValue.length > 2) {
            setIsMax(true);
        } else {
            setIsMax(false);
        }

        if (submitted) {
            console.log(searchValue.map((search) => search.value));
            setSubmitted(false);
        }
    }, [searchValue, submitted]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsError(false);

        const input = event.target.value;
        const isSpace = input.endsWith(' ');

        if (isSpace) {
            handleNewValue(input.trim());
        }
    };

    const handleKeydown = (event: React.KeyboardEvent) => {
        if (event.key === 'Backspace' && getValue('#search-post') === '') {
            setSearchValue(searchValue.slice(0, -1));
        }
    };

    const handleNewValue = (value: string) => {
        emptyValue('#search-post');

        if (searchValue.find((search) => search.value === value) || isMax) {
            return;
        }

        const hashtag = (
            <Chip
                variant="outlined"
                color="primary"
                key={value}
                label={'# ' + value}
                sx={{ mr: 1, fontWeight: 600 }}
                clickable
                onClick={() => {
                    setSearchValue((searchValue) => {
                        return searchValue.filter(
                            (search) => search.value !== value
                        );
                    });
                    setFocus('#search-post');
                }}
            />
        );

        const newValue: SearchPostValue = { value, hashtag };
        setSearchValue(searchValue.concat(newValue));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const input = data.get('search-post') as string;
        if (input) {
            handleNewValue(input.trim());
        }

        if (searchValue.length === 0 && !input) {
            setIsError(true);
            return setFocus('#search-post');
        }

        removeFocus('#search-post');
        return setSubmitted(true);
    };

    return (
        <Box
            component={'form'}
            onSubmit={handleSubmit}
            width={'100%'}
            maxWidth={500}
        >
            <TextField
                id="search-post"
                name="search-post"
                autoComplete="off"
                fullWidth
                InputProps={{
                    sx: {
                        borderRadius: 7,
                        px: 3,
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    startAdornment: (
                        <>{searchValue.map((search) => search.hashtag)}</>
                    ),
                }}
                placeholder={searchValue.length > 0 ? '' : placeholderText}
                helperText={
                    isError ? errorHelperText : isMax ? maxHelperText : ''
                }
                error={isError}
                onChange={handleChange}
                onKeyDown={handleKeydown}
            />
        </Box>
    );
};
