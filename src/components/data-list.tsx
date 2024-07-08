import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { GiftResponse, ProductResponse } from '../types/advancedTypes';

const DataList = ({ title, control, name, errors }: { control: any; name: string; title: string; errors?: string }) => {
    const { fields, update } = useFieldArray({ control, name });
    return (
        <Box mx={2} mt={2}>
            <Box p={2} borderRadius={1} border={`1px dashed`} component={'fieldset'}>
                <Typography px={0.5} component={'legend'} variant="subtitle2">
                    {title}
                </Typography>
                <Stack spacing={2}>
                    {_.map(fields, (t: ProductResponse & GiftResponse & { id: string }, index: number) => (
                        <DataItem key={t.productId || t.giftId} item={t} index={index} update={update} />
                    ))}
                </Stack>
            </Box>
            {Boolean(errors) && (
                <Typography variant="caption" color={'error.main'}>
                    {errors}
                </Typography>
            )}
        </Box>
    );
};

export default DataList;

const DataItem = (props: { item: ProductResponse & GiftResponse; index: number; update: any }) => {
    const { item: t, index, update } = props;

    const [quantity, setQuantity] = useState(t.quantity || 0);
    const increment = () => {
        setQuantity((prevCount) => {
            let a = Number(prevCount);
            update(index, { ...t, quantity: a + 1 });
            return (a += 1);
        });
    };

    const decrement = () => {
        setQuantity((prevCount) => {
            let a = Number(prevCount);

            if (a > 0) {
                update(index, { ...t, quantity: a - 1 });
                return (a -= 1);
            } else {
                return (a = 0);
            }
        });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Number(e.target.value);
        setQuantity(newQuantity);
        update(index, { ...t, quantity: newQuantity });
    };

    return (
        <Stack direction={'row'} flex={1}>
            <Stack flex={1} justifyContent={'center'}>
                <Typography variant="subtitle2">{_.get(t, 'productName') || _.get(t, 'giftName')}</Typography>
                <Typography variant="caption">{_.get(t, 'productCode')}</Typography>
            </Stack>

            <Stack direction={'row'} flex={2} spacing={1} alignItems={'center'} justifyContent={'center'}>
                <Button sx={{ height: 40, minWidth: 40 }} variant="outlined" onClick={decrement}>{`-`}</Button>
                <TextField
                    inputProps={{ min: 0, style: { textAlign: 'center' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={quantity}
                    onChange={onChange}
                    size="small"
                    type="number"
                />
                <Button sx={{ height: 40, minWidth: 40 }} variant="outlined" onClick={increment}>{`+`}</Button>
            </Stack>
        </Stack>
    );
};
