import React, { ReactEventHandler, useRef, useState } from "react";
import { debounce } from "lodash-es";
import styles from "../../../styles/Info.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { setView } from '../../../redux/kakaoMapSlice';
import { RootState } from "../../../redux/store";
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Info = () => {
  const [keyword, setKeyword] = useState<String>("");
  const [place, setPlace] = useState<Object[]>([]);
  const [ulId, setUlId] = useState<String>("");

  const view = useSelector((state: RootState) => state.kakaoMap.currentView);

  const dispatch = useDispatch();

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if(value === "") {
      setPlace([{}]);
    } else {
      setKeyword(value);
      // debounceAddress(value);
    }
  }

  const enter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      search();
    }      
  }

  const search = () => {
    debounceAddress(keyword);
  }

  const debounceAddress = debounce((item) => {
    SearchMap(item);
  }, 0); 

  const SearchMap = (item: string) => {
    const ps = new window.kakao.maps.services.Places();

    const placesSearchCB = function (data: any[], status: any) {
      if (status === window.kakao?.maps.services.Status.OK) {
        setPlace(data);
        setDefaultStyle(data);
      }
    };
    ps.keywordSearch(`${item}`, placesSearchCB);
  };

  const setDefaultStyle = (data: Object[]) => {
    data.forEach(search => {
      const element = document.getElementById(`ul_${search.id}`);
      if(element !== null)
        element.className = styles.searchElement; 
    });
  }

  const viewPlace = (loc: Object) => {
    if(ulId.length > 0) {
      const element = document.getElementById(String(ulId));
      if(element !== null)
        element.className = styles.searchElement;  
    }
    
    if(loc.id !== undefined) {
      if(loc.id !== view.id) {
        setUlId(`ul_${loc.id}`);
        dispatch(setView(loc));
        document.getElementById(`ul_${loc.id}`).className = styles.activeElement;
      } else {
        dispatch(setView({}));
        document.getElementById(`ul_${loc.id}`).className = styles.searchElement;
      }
    }
  }

  return (
    <>
      <div className={styles.searchWrap}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          className={styles.searchInputBox}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'Search' }}
            onChange = {onChange}
            onKeyPress = {enter}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={search}>
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          
        </Paper>
        <div className={styles.searchContainer}>
          {place.map(loc => (
            Object.keys(loc).length !== 0 && 
            <div key={loc.id}>
              <ul id={`ul_${loc.id}`} className={styles.searchElement} onClick={() => viewPlace(loc)}>
                <li className={styles.placeName}>{loc.place_name}</li>
                <span className={styles.addressName}>{loc.address_name}</span>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Info;