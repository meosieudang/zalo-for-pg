import { Box, Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { configAppView } from 'zmp-sdk/apis';

const ImageReview = ({ open, handleClose, img }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <Box display={'flex'} flexDirection={'column'} height={'100vh'} flex={1}>
                <img
                    onClick={handleClose}
                    src={img}
                    alt={''}
                    style={{ width: 'auto', height: 'auto', objectFit: 'fill', position: 'fixed' }}
                />
            </Box>
        </Dialog>
    );
};

export default ImageReview;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
