'use client';

import { HTMLAttributes, Key, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type {
    BookSearchItemData,
    BookItem,
} from '@/app/api/books/searchByTerm/route';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function SearchBook() {
    const { push } = useRouter();
    const [options, setOptions] = useState<BookItem[]>([]);

    const placeholderText = '책 제목 또는 저자를 검색해 보세요.';
    const noOptionsText = '해당하는 책이 없습니다.';

    const handleChange = async (value: string) => {
        if (!value) {
            return setOptions([]);
        }

        const header = new Headers({ search: encodeURIComponent(value) });
        const res = await fetch('/api/books/searchByTerm', {
            headers: header,
        });

        const data: BookSearchItemData = await res.json();
        const items: BookItem[] = data.item;

        setOptions(items);
    };

    const handleSearch = (value: BookItem | null) => {
        if (!value) {
            return;
        }

        push(`/book/${value.isbn13}`);
    };

    return (
        <Autocomplete
            fullWidth
            sx={{ maxWidth: 500 }}
            options={options}
            noOptionsText={noOptionsText}
            renderInput={(params) => (
                <TextField {...params} placeholder={placeholderText} />
            )}
            getOptionLabel={(option) => option.title}
            renderOption={(props, option) => {
                const { key, ...restProps } =
                    props as HTMLAttributes<HTMLLIElement> & { key: Key };
                const prop = { ...restProps };
                return (
                    <Box
                        component={'li'}
                        display={'flex'}
                        gap={1}
                        key={key}
                        {...prop}
                    >
                        <Box display={{ xs: 'none', sm: 'block' }}>
                            <Image
                                width="35"
                                height="45"
                                src={option.cover}
                                alt={option.isbn13}
                            />
                        </Box>
                        <Stack direction={'column'}>
                            <Typography
                                noWrap
                                component={'span'}
                                width={{ xs: 300, sm: 350, md: 400 }}
                            >
                                {option.title}
                            </Typography>
                            <Stack
                                direction={'row'}
                                spacing={0.5}
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                            >
                                <Typography
                                    noWrap
                                    component={'span'}
                                    width={100}
                                    fontSize={12}
                                >
                                    {option.author}
                                </Typography>
                                <Typography
                                    noWrap
                                    component={'span'}
                                    width={100}
                                    fontSize={12}
                                >
                                    {option.publisher}
                                </Typography>
                                <Typography
                                    noWrap
                                    component={'span'}
                                    width={100}
                                    fontSize={12}
                                >
                                    {option.pubDate}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                );
            }}
            isOptionEqualToValue={(option, value) =>
                option.isbn13 === value.isbn13
            }
            onInputChange={(event, value) => handleChange(value)}
            onChange={(event, value) => handleSearch(value)}
        />
    );
}
