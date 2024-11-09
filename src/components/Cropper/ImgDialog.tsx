import React, { useState } from 'react';
import Image from 'next/image';
// import { withStyles } from '@material-ui/core/styles'
// import Dialog from '@material-ui/core/Dialog'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
// import Typography from '@material-ui/core/Typography'
// import CloseIcon from '@material-ui/icons/Close'
// import Slide from '@material-ui/core/Slide'

const ImgDialog = ({ img }: any) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    // this.setState({ open: true });
    setOpen(true);
  };

  const handleClose = () => {
    // this.setState({ open: false });
    setOpen(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        padding: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        src={img}
        alt='Cropped'
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export default ImgDialog;
