import { Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const CameraModal = ({ children, open, handleClose }) => {
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            {children}
        </Dialog>
    );
};

export default CameraModal;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
