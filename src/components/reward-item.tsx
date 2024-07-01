import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import award from '../static/icons/award.png';

const RewardItem = ({ name, urlImg, onPressDetail, onPressExchange, hidePoint = false, status = false }) => {
    const point = 1;
    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Box zIndex={9} p={1} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                <img src={urlImg} style={{ width: 48, height: 48, zIndex: 9 }} />
                <Typography
                    variant="subtitle2"
                    sx={{
                        mt: 1.5,
                        zIndex: 9,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        maxWidth: 100
                    }}
                >
                    {name}
                </Typography>

                <Box sx={{ my: 1.5, bgcolor: 'red', width: '100%' }}>
                    <LinearProgress color="error" variant="determinate" value={70} />
                </Box>

                <Stack spacing={1} direction={'row'}>
                    <Button
                        onClick={onPressDetail}
                        sx={{ textTransform: 'capitalize', fontSize: 12 }}
                        size="small"
                        variant="outlined"
                    >{`Chi tiết`}</Button>
                    {hidePoint ? null : (
                        <Button
                            onClick={onPressExchange}
                            size="small"
                            variant="contained"
                            sx={{ textTransform: 'capitalize', fontSize: 12 }}
                        >{`Đổi điểm`}</Button>
                    )}
                    {status && (
                        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize', fontSize: 12 }}>{`Đang xử lý`}</Button>
                    )}
                </Stack>
            </Box>

            {hidePoint ? null : (
                <>
                    <img
                        src={award}
                        style={{
                            width: 60,
                            height: 60,
                            position: 'absolute',
                            right: -20,
                            top: -12,
                            overflow: 'visible'
                        }}
                    />
                    <Typography
                        variant="subtitle2"
                        position={'absolute'}
                        right={_.toString(point).length === 2 ? 2 : _.toString(point).length === 3 ? -2 : 6}
                        fontWeight={'bold'}
                    >
                        {point}
                    </Typography>
                </>
            )}
        </Paper>
    );
};

export default RewardItem;
