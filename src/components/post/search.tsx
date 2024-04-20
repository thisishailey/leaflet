'use client';

import { useEffect, useState } from 'react';
import { setFocus, emptyValue, getValue } from '@/util/common';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchIcon from '@mui/icons-material/Search';

interface SearchPostValue {
    value: string;
    hashtag: React.ReactNode;
}

interface Props {
    handleSearch: (search: string[]) => void;
}

export default function SearchPost({ handleSearch }: Props) {
    const [searchValue, setSearchValue] = useState<SearchPostValue[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isMax, setIsMax] = useState<boolean>(false);

    const placeholderText = '읽고 싶은 키워드를 검색해 보세요.';
    const errorHelperText = '검색할 키워드를 1개 이상 입력해 주세요.';
    const maxHelperText = '최대 3개까지 입력할 수 있어요.';

    useEffect(() => {
        if (searchValue.length > 2) {
            setIsMax(true);
        } else {
            setIsMax(false);
        }
    }, [searchValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsError(false);

        const input = event.target.value;
        const isSpace = input.endsWith(' ');

        if (isSpace) {
            handleAddValue(input.trim());
        }
    };

    const handleKeydown = (event: React.KeyboardEvent) => {
        if (event.key === 'Backspace' && getValue('#search-post') === '') {
            handleRemoveValue(searchValue[searchValue.length - 1].value);
        }
    };

    const handleRemoveValue = (value: string) => {
        let values: SearchPostValue[];
        setSearchValue((searchValue) => {
            values = searchValue.filter((search) => search.value !== value);
            return values;
        });

        handleSubmit(values!.map((value) => value.value));
    };

    const handleEmptyValue = () => {
        setSearchValue([]);

        handleSubmit([]);
    };

    const handleAddValue = (value: string) => {
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
                onClick={() => handleRemoveValue(value)}
            />
        );

        const newValue: SearchPostValue = { value, hashtag };
        const values = searchValue.concat(newValue);
        setSearchValue(values);

        handleSubmit(values.map((value) => value.value));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const input = data.get('search-post') as string;
        if (input) {
            return handleAddValue(input.trim());
        }

        handleSubmit(searchValue.map((value) => value.value));
    };

    const handleSubmit = (values: string[]) => {
        setFocus('#search-post');
        handleSearch(values);
    };

    return (
        <Box
            component={'form'}
            onSubmit={handleFormSubmit}
            width={'100%'}
            maxWidth={500}
        >
            <TextField
                id="search-post"
                name="search-post"
                autoComplete="off"
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchValue.length > 0 && (
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={handleEmptyValue}
                                >
                                    <CloseRoundedIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton type="submit">
                                <SearchIcon />
                            </IconButton>
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
}
