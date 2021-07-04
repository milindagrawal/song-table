import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import "../styles.css";

export default function DeleteConfirmModal(props) {
  const { name, onNoClick, onYesClick } = props;

  return (
    <Dialog
      onClose={() => {}}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle id="confirmation-dialog-title">
        Delete Confirmation!
      </DialogTitle>
      <DialogContent dividers>
        <span>{`Are you sure you want to delete ${name}?`}</span>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={onNoClick}>
          No
        </Button>
        <Button variant="contained" color="primary" onClick={onYesClick}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmModal.propTypes = {
  name: PropTypes.string,
  onNoClick: PropTypes.func,
  onYesClick: PropTypes.func
};
