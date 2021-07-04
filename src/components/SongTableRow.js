import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  CELL_WIDTH_ARRAY,
  DOWNVOTE_KEY,
  UPVOTE_KEY
} from "../songTableConstants";

import SongAddOrEditModal from "./SongAddOrEditModal";
import DeleteConfirmationModal from "./DeleteConfirmModal";

export default function SongTableRow(songInfo) {
  const [showAddOrEditModal, setShowAddOrEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmationModal] = useState(false);
  const {
    id,
    song_name,
    album_name,
    lyric_text,
    upvote,
    downvote,
    toggleVote,
    onDelete,
    backgroundColor
  } = songInfo;

  const _renderVotingIcon = (source, label, onClick) => {
    return (
      <div className="actionButtonContainer">
        <img
          src={source}
          alt="Action Icon"
          className="actionIcon"
          onClick={onClick}
        />
        <span>{label}</span>
      </div>
    );
  };

  const _renderActionButtons = () => (
    <div className="cell" style={{ width: CELL_WIDTH_ARRAY[4] + "%" }}>
      {_renderVotingIcon(require("../images/upvote.png"), `Up: ${upvote}`, () =>
        toggleVote(id, UPVOTE_KEY)
      )}
      {_renderVotingIcon(
        require("../images/downvote.png"),
        `Down: ${downvote}`,
        () => toggleVote(id, DOWNVOTE_KEY)
      )}
      {_renderVotingIcon(require("../images/edit.png"), "Edit", () =>
        setShowAddOrEditModal(true)
      )}
      {_renderVotingIcon(require("../images/delete.png"), "Delete", () =>
        setShowConfirmationModal(true)
      )}
    </div>
  );

  return (
    <div className="songInfoContainer" style={{ backgroundColor }}>
      <div className="cell" style={{ width: CELL_WIDTH_ARRAY[0] + "%" }}>
        <span>{id}</span>
      </div>
      <div className="cell" style={{ width: CELL_WIDTH_ARRAY[1] + "%" }}>
        <span>{song_name}</span>
      </div>
      <div className="cell" style={{ width: CELL_WIDTH_ARRAY[2] + "%" }}>
        <span>{album_name}</span>
      </div>
      <div className="cell" style={{ width: CELL_WIDTH_ARRAY[3] + "%" }}>
        <span>{lyric_text}</span>
      </div>
      {_renderActionButtons()}
      {showAddOrEditModal && (
        <SongAddOrEditModal
          songDetails={songInfo}
          onClose={() => setShowAddOrEditModal(false)}
          actionText="Update"
        />
      )}
      {showConfirmModal && (
        <DeleteConfirmationModal
          name={song_name}
          onNoClick={() => setShowConfirmationModal(false)}
          onYesClick={() => {
            setShowConfirmationModal(false);
            onDelete(id);
          }}
        />
      )}
    </div>
  );
}

SongTableRow.propTypes = {
  id: PropTypes.string,
  song_name: PropTypes.string,
  album_name: PropTypes.string,
  lyric_text: PropTypes.string,
  upvote: PropTypes.number,
  downvote: PropTypes.number,
  toggleVote: PropTypes.func,
  onDelete: PropTypes.func,
  cellWidthArray: PropTypes.array
};
