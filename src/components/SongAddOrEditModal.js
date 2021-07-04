import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const SongAddOrEditModal = (props) => {
  const {
    songDetails: {
      id,
      song_name,
      album_name,
      lyric_text,
      onAddSong,
      onUpdateSong
    },
    actionText,
    onClose
  } = props;
  const [songName, setSongName] = useState(song_name);
  const [albumName, setAlbumName] = useState(album_name);
  const [lyricText, setLyricText] = useState(lyric_text);
  const [errors, setErrors] = useState({});

  const _onInputChange = (event, stateUpdater) => {
    const { value } = event.currentTarget;
    stateUpdater(value);
  };

  const _onAddOrUpdateClick = () => {
    if (!songName || !albumName || !lyricText) {
      setErrors({
        songName: !songName ? "Please enter song name" : "",
        albumName: !albumName ? "Please enter album name" : "",
        lyricText: !lyricText ? "Please enter lyric text" : ""
      });

      return;
    }

    const songDetails = {
      song_name: songName,
      album_name: albumName,
      lyric_text: lyricText
    };

    if (!!id) {
      onUpdateSong({ id, ...songDetails });
    } else {
      onAddSong({
        id: Math.random(),
        ...songDetails,
        upvote: 0,
        downvote: 0
      });
    }

    onClose();
  };

  const _renderFields = (label, children, fieldKey) => {
    return (
      <div className="inputFieldContainer">
        <label>{label}:*</label>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {children}
          {!!errors[fieldKey] && <span>{errors[fieldKey]}</span>}
        </div>
      </div>
    );
  };

  const _renderContent = () => (
    <DialogContent dividers>
      <h3>Song Number: {id || "NA"}</h3>
      {_renderFields(
        "Song Name",
        <input
          type="text"
          value={songName}
          onChange={(event) => {
            _onInputChange(event, setSongName);
          }}
          required
        />,
        "songName"
      )}
      {_renderFields(
        "Album Name",
        <input
          type="text"
          value={albumName}
          onChange={(event) => {
            _onInputChange(event, setAlbumName);
          }}
          required
        />,
        "albumName"
      )}
      {_renderFields(
        "Lyric Text",
        <textarea
          value={lyricText}
          onChange={(event) => {
            _onInputChange(event, setLyricText);
          }}
          required
        >
          {lyricText}
        </textarea>,
        "lyricText"
      )}
    </DialogContent>
  );

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle>Song Information Form</DialogTitle>
      {_renderContent()}
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={_onAddOrUpdateClick}
        >
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SongAddOrEditModal.propTypes = {
  songDetails: {
    id: PropTypes.string,
    song_name: PropTypes.string,
    album_name: PropTypes.string,
    lyric_text: PropTypes.string,
    onAddSong: PropTypes.func,
    onUpdateSong: PropTypes.func
  },
  actionText: PropTypes.string
};

export default SongAddOrEditModal;
