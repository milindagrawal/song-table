import React, { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import _ from "lodash";

import songs from "./songs";
import SongTableRow from "./components/SongTableRow";
import SongAddOrEditModal from "./components/SongAddOrEditModal";
import {
  DEFAULT_DISPLAY_COUNT,
  CELL_WIDTH_ARRAY,
  DOWNVOTE_KEY,
  UPVOTE_KEY,
  SONG_NAME_KEY,
  ALBUM_NAME_KEY,
  LYRIC_TEXT_KEY
} from "./songTableConstants";
import "./styles.css";

export default function SongList() {
  const _getTotalPages = (list, displayCount) => {
    return Math.ceil(list.length / displayCount);
  };

  const [state, setState] = useState({
    songList: songs,
    inputText: "",
    sortingKey: "",
    activePage: 1,
    displayCount: DEFAULT_DISPLAY_COUNT,
    showAddOrEditModal: false
  });

  const _getPaginatedList = (list, activePage) => {
    const { displayCount } = state;
    const start = displayCount * (activePage - 1);
    return list.slice(start, start + displayCount);
  };

  const _onPageChange = (event, page) => {
    setState((prevState) => ({
      ...prevState,
      activePage: page
    }));
  };

  const _onInputChange = (event) => {
    const { activePage } = state;
    const { value } = event.currentTarget;
    const inputText = value.replace(/[^a-zA-Z ]+/g, "");

    setState((prevState) => ({
      ...prevState,
      inputText,
      activePage: !!inputText ? 1 : activePage
    }));
  };

  const _toggleVote = (id, voteType) => {
    const { songList } = state;
    const newSongList = songList.map((details) => {
      const newDetails = { ...details };

      if (newDetails.id === id) {
        if (voteType === DOWNVOTE_KEY) {
          newDetails[DOWNVOTE_KEY] = 1;
          newDetails[UPVOTE_KEY] = 0;
        } else {
          newDetails[DOWNVOTE_KEY] = 0;
          newDetails[UPVOTE_KEY] = 1;
        }
      }

      return newDetails;
    });

    setState((prevState) => ({
      ...prevState,
      songList: newSongList
    }));
  };

  const _updateSong = (newDetails) => {
    const { songList } = state;
    const newSongList = songList.map((details) => {
      if (newDetails.id === details.id) {
        return { ...details, ...newDetails };
      }

      return details;
    });

    setState((prevState) => ({
      ...prevState,
      songList: newSongList
    }));
  };

  const _addSong = (newSong) => {
    const { songList } = state;
    const newSongList = _.cloneDeep(songList);
    newSongList.push(newSong);

    setState((prevState) => ({
      ...prevState,
      songList: newSongList
    }));
  };

  const _onDelete = (id) => {
    const { songList } = state;
    const newSongList = songList.filter((details) => {
      return details.id !== id;
    });

    setState((prevState) => ({
      ...prevState,
      songList: newSongList
    }));
  };

  const _renderSearchBox = () => {
    const { inputText } = state;

    return (
      <div className="searchBoxContainer">
        <label>Search</label>
        <input
          type="text"
          value={inputText}
          placeholder="Enter text to search"
          onChange={_onInputChange}
        />
      </div>
    );
  };

  const _getSongListForDisplay = () => {
    const { songList, inputText, sortingKey } = state;
    let finalSongList = songList;

    if (!!inputText) {
      finalSongList = songList.filter((details) => {
        const matchInSong = _.includes(
          details.song_name.toLowerCase(),
          inputText.toLowerCase()
        );
        const matchInAlbum = _.includes(
          details.album_name.toLowerCase(),
          inputText.toLowerCase()
        );
        const matchInLyric = _.includes(
          details.lyric_text.toLowerCase(),
          inputText.toLowerCase()
        );

        return matchInSong || matchInAlbum || matchInLyric;
      });
    }

    return _.orderBy(finalSongList, sortingKey, "desc");
  };

  const _onFilterDropdownChange = (event) => {
    const { value } = event.currentTarget;

    setState((prevState) => ({
      ...prevState,
      displayCount: value
    }));
  };

  const _renderFilterDropdown = () => {
    const { displayCount } = state;

    return (
      <label>
        Show{" "}
        <select onChange={_onFilterDropdownChange} value={displayCount}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>{" "}
        Records
      </label>
    );
  };

  const _renderFooter = (orderedSongList) => {
    const { displayCount, activePage } = state;
    const activeTotalPages = _getTotalPages(orderedSongList, displayCount);

    return (
      <div className="footer">
        <div
          className="addSongContainer"
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              showAddOrEditModal: true
            }))
          }
        >
          <h2>Add Song</h2>
        </div>
        <Pagination
          color="secondary"
          page={activePage}
          count={activeTotalPages}
          variant="outlined"
          shape="rounded"
          onChange={_onPageChange}
        />
      </div>
    );
  };

  const _sortTable = (fieldKey) => {
    const { sortingKey } = state;
    const newSortingKey = sortingKey === fieldKey ? "" : fieldKey;

    setState((prevState) => ({
      ...prevState,
      sortingKey: newSortingKey
    }));
  };

  const _renderSortingCell = (label, index, onClick) => {
    return (
      <div
        className="cell"
        style={{ width: CELL_WIDTH_ARRAY[index] + "%", cursor: "pointer" }}
        onClick={onClick}
      >
        <label>{label}</label>
        <img
          src={require("./images/sorting.png")}
          alt="Sorting Icon"
          className="actionIcon"
        />
      </div>
    );
  };

  const _renderTableHeader = () => {
    return (
      <div className="tableHeader">
        <div className="cell" style={{ width: CELL_WIDTH_ARRAY[0] + "%" }}>
          <label>Id</label>
        </div>
        {_renderSortingCell("Song Name", 1, () => _sortTable(SONG_NAME_KEY))}
        {_renderSortingCell("Album Name", 2, () => _sortTable(ALBUM_NAME_KEY))}
        {_renderSortingCell("Lyric Text", 3, () => _sortTable(LYRIC_TEXT_KEY))}
        <div className="cell" style={{ width: CELL_WIDTH_ARRAY[4] + "%" }}>
          <label>Action</label>
        </div>
      </div>
    );
  };

  const { showAddOrEditModal, activePage } = state;
  const orderedSongList = _getSongListForDisplay();
  const paginatedSongList = _getPaginatedList(orderedSongList, activePage);

  return (
    <div className="app">
      <div className="filterContainer">
        {_renderFilterDropdown()}
        {_renderSearchBox()}
      </div>
      {_renderTableHeader()}
      {paginatedSongList.map((details, index) => {
        return (
          <SongTableRow
            {...details}
            key={details.id}
            toggleVote={_toggleVote}
            onDelete={_onDelete}
            onUpdateSong={_updateSong}
            onAddSong={_addSong}
            backgroundColor={index % 2 === 0 ? "#F1F1F1" : "#FFF"}
          />
        );
      })}
      {showAddOrEditModal && (
        <SongAddOrEditModal
          songDetails={{
            onAddSong: _addSong,
            onUpdateSong: _updateSong
          }}
          onClose={() =>
            setState((prevState) => ({
              ...prevState,
              showAddOrEditModal: false
            }))
          }
          actionText="Add"
        />
      )}
      {_renderFooter(orderedSongList)}
    </div>
  );
}
