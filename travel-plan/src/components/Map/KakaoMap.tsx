import React, { useEffect, useState } from "react";
import styles from "../../../styles/KakaoMap.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import { addPlan } from "../../../redux/planSlice";
import Paper from '@mui/material/Paper';
import { setLoded, setViewBounds } from "../../../redux/kakaoMapSlice";

const KakaoMap = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState<any>({});
  const [marker, setMarker] = useState<any>({});
  const [infoWindow, setInfoWindow] = useState<any>({});
  const [placeMarkers, setPlaceMarkers] = useState<Array<any>>([]);
  const [linePath, setLinePath] = useState<Array<any>>([]);
  const [polyLine, setPolyLine] = useState<any>({});
  const view = useSelector((state: RootState) => state.kakaoMap.currentView);
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => state.plan.node);
  const viewBounds = useSelector((state: RootState) => state.kakaoMap.viewBounds);

  useEffect(() => {
    if(viewBounds && linePath.length !== 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      linePath.forEach(line => {
        bounds.extend(line);
      })
      map.setBounds(bounds);
    }
    dispatch(setViewBounds(false));
  }, [viewBounds])

  useEffect(() => {
    removePlaceMarker();
    removeLine();
    const placeMarkers = [];
    const linePositions = [];
    node.forEach((n, idx) => {
      let placePosition = new window.kakao.maps.LatLng(n.y, n.x);
      linePositions.push(placePosition);
      const marker = addMarker(placePosition, idx, undefined);
      placeMarkers.push(marker);
    });
    setPlaceMarkers(placeMarkers);
    drawLine(linePositions);
  }, [node])

  useEffect(() => {
    setInfoWindow(infoWindow);
    const closeButton = document.getElementById("closeButton");
    if(closeButton !== null) {
      closeButton.onclick = (e) => close(e);
    }
    const addButton = document.getElementById("addButton");
    if(addButton !== null) {
      addButton.onclick = (e) => addPlanList(e);
    }
  }, [infoWindow]);

  useEffect(() => {
    if(view.id !== 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      let placePosition = new window.kakao.maps.LatLng(view.y, view.x);
      bounds.extend(placePosition);
      map.setBounds(bounds);
      removeMarker();
      const marker = drawMarker(placePosition);
      addMouseEvent(marker, view);
    } else {
      removeMarker();
      closeInfoWindow();
    }
  }, [view]);

  useEffect(() => {
    const $script = document.createElement("script");
    $script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services,drawing`;
    $script.addEventListener("load", () => setMapLoaded(true));
    dispatch(setLoded(true)); 
    document.head.appendChild($script);
  }, []);

  useEffect(() => {
    if (!mapLoaded) return;
    
    window.kakao.maps.load(() => {
      let container = document.getElementById('map');
      let options = {
        center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
        level: 3
      };

      setMap(new window.kakao.maps.Map(container, options));
    })
    
  }, [mapLoaded]);

  const removeLine = () => {
    if(Object.keys(polyLine).length !== 0)
      polyLine.setMap(null);
  } 

  const drawLine = (linePositions: Array<Object>) => {
    if (!mapLoaded) return;
    setLinePath(linePositions);
    const polyLine = new window.kakao.maps.Polyline({
      path: linePositions, // ?????? ???????????? ???????????? ?????????
      strokeWeight: 5, // ?????? ?????? ?????????
      strokeColor: '#050400', // ?????? ???????????????
      strokeOpacity: 0.5, // ?????? ???????????? ????????? 1?????? 0 ????????? ????????? 0??? ??????????????? ???????????????
      strokeStyle: 'solid' // ?????? ??????????????????
    });
    setPolyLine(polyLine);
    polyLine.setMap(map);
  }

  const drawMarker = (position: any) => {
    const marker = new window.kakao.maps.Marker({
        position: position, // ????????? ??????
      });
    setMarker(marker);
    
    marker.setMap(map); // ?????? ?????? ????????? ??????
    return marker;
  }

  const addMarker = (position: any, idx: number, title: undefined) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // ?????? ????????? url, ??????????????? ?????????
        imageSize = new window.kakao.maps.Size(36, 37),  // ?????? ???????????? ??????
        imgOptions =  {
          spriteSize : new window.kakao.maps.Size(36, 691), // ??????????????? ???????????? ??????
          spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10), // ??????????????? ????????? ??? ????????? ????????? ????????? ??????
          offset: new window.kakao.maps.Point(13, 37) // ?????? ????????? ???????????? ????????? ???????????? ??????
        },
        markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new window.kakao.maps.Marker({
          position: position, // ????????? ??????
          image: markerImage 
        });
    
    
    marker.setMap(map); // ?????? ?????? ????????? ??????
    return marker;
  }

  const addPlanList = (e: any) => {
    e.preventDefault();
    alert(`${view.place_name}??? ????????? ?????????????????????.`);
    dispatch(addPlan(view));
    closeInfoWindow();
  }

  const closeInfoWindow = () => {
    if(Object.keys(infoWindow).length !== 0) {
      infoWindow.close();
      setInfoWindow({});
    }
  }
  const close = (e: any) : void => {
    e.preventDefault();
    closeInfoWindow();
  }

  const addMouseEvent = (marker: Object, view: Object) => {
    closeInfoWindow();

    let iwContent = createInfoWindow();

    const info = new window.kakao.maps.InfoWindow({
      zIndex: 1,
      content: iwContent
    });
    info.open(map, marker);
    setInfoWindow(info);
  }

  const removeMarker = () => {
    if(Object.keys(marker).length !== 0) {
      marker.setMap(null);
      setMarker({});
    }
  }

  const removePlaceMarker = () => {
    placeMarkers.forEach(marker => {
      marker.setMap(null);
    })
    setPlaceMarkers([]);
  }

  const createInfoWindow = () => {
    const iwContent = document.createElement("div");
    let container = document.createElement("div");
    container.className = styles.infoContainer;
    let link = document.createElement("a");
    link.href = view.place_url.toString();
    link.textContent = view.place_name.toString();
    container.appendChild(link);
    let br = document.createElement("br");
    container.appendChild(br);
    let address = document.createElement("div");
    address.className = styles.address;
    address.textContent = view.address_name.toString();
    container.appendChild(address);
    container.appendChild(br);
    let addButton = document.createElement("button");
    addButton.id = "addButton"
    addButton.textContent = "????????? ??????";
    container.appendChild(addButton);
    let closeButton = document.createElement("button");
    closeButton.id = "closeButton"
    closeButton.textContent = "??????";
    container.appendChild(closeButton);
    iwContent.append(
      container
    );
    return iwContent;
  }

  return (
    <Paper className={styles.mapContainer}>
      <div id="map" className={styles.map} />
    </Paper>
  );
};

export default KakaoMap;