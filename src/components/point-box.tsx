import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import React, { useImperativeHandle } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import medal from '../static/icons/medal.png';
import { useGetLoyaltyPointTotal } from '../hooks/useApiv2';
import { useAuth } from '../contexts/AuthContext';
import { Divider } from '@mui/material';

export const refPointBox = React.createRef<{ fetchData: () => void }>();
const PointBox = ({ campaignId }) => {
    const { user } = useAuth();
    const qGetLoyaltyPointTotal = useGetLoyaltyPointTotal({
        zaloId: user?.id ?? null
    });
    const d = _.find(qGetLoyaltyPointTotal.data?.data, (t) => t.campaignId === Number(campaignId));

    useImperativeHandle(refPointBox, () => ({
        fetchData: qGetLoyaltyPointTotal.refetch
    }));
    return (
        <Paper
            elevation={5}
            sx={{
                minHeight: 60,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                mx: 2,
                mt: 2
                // position: "absolute",
                // width: "92vw",
                // left: "50%",
                // transform: "translate(-50%, -50%)",
            }}
        >
            <Stack flex={1} justifyContent={'space-between'} direction={'row'} alignItems={'center'} p={2} spacing={1}>
                <Typography>{`Điểm tích lũy:`}</Typography>
                <Box flex={1} />
                <img src={medal} style={{ height: 24, width: 24 }} />
                <Typography fontWeight={'bold'}>{d?.totalPoint}</Typography>
            </Stack>
            <Divider />
            <Stack flex={1} justifyContent={'space-between'} direction={'row'} alignItems={'center'} p={2} spacing={1}>
                <Typography>{`Tên chương trình:`}</Typography>

                <Typography fontWeight={'bold'}>{d?.campaignName}</Typography>
            </Stack>
        </Paper>
    );
};

export default PointBox;
