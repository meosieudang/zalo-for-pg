import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { BASE_URL_IMG } from '../../constant';
import giftIcon from '../../static/icons/gift.png';
import { Gift } from '../../types/api';
interface Props extends Gift {
    createdDate?: string;
}
const GiftItem = ({ giftName, quantity, createdDate, giftWinImage }: Props) => {
    return (
        <Stack direction={'row'} spacing={1} border={1} borderColor={'grey.300'} borderRadius={3} p={1} alignItems={'center'}>
            <Stack>
                <img
                    src={Boolean(giftWinImage) ? `${BASE_URL_IMG}${giftWinImage}` : giftIcon}
                    height={60}
                    width={60}
                    style={{ alignSelf: 'center' }}
                />
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ borderStyle: 'dashed' }} />
            <Stack flex={2} gap={0.5}>
                <Typography variant="body2">{giftName}</Typography>
                <Typography variant="body2">{`SL: ${quantity}`}</Typography>
                <Typography variant="body2">{`Ngày đổi: ${createdDate}`}</Typography>
            </Stack>
        </Stack>
    );
};

export default GiftItem;
