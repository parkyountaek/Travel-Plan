import React, { useEffect, useState } from "react";
import styles from "../../../styles/KakaoMap.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import { addPlan } from "../../../redux/planSlice";
import Paper from '@mui/material/Paper';
import { setLoded, setViewBounds } from "../../../redux/kakaoMapSlice";

const KakaoMap = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [map, setMap] = useState<Object>({});
  const [marker, setMarker] = useState<Object>({});
  const [infoWindow, setInfoWindow] = useState<Object>({});
  const [placeMarkers, setPlaceMarkers] = useState<Array<Object>>([]);
  const [linePath, setLinePath] = useState<Array<Object>>([]);
  const [polyLine, setPolyLine] = useState<Object>({});
  const view = useSelector((state: RootState) => state.kakaoMap.currentView);
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => state.plan.node);
  const viewBounds = useSelector((state: RootState) => state.kakaoMap.viewBounds);

  useEffect(() => {
    if(viewBounds && linePath.length !== 0) {
      const bounds = new kakao.maps.LatLngBounds();
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
      let placePosition = new kakao.maps.LatLng(n.y, n.x);
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
      closeButton.onclick = close;
    }
    const addButton = document.getElementById("addButton");
    if(addButton !== null) {
      addButton.onclick = addPlanList;
    }
  }, [infoWindow]);

  useEffect(() => {
    if(Object.keys(view).length !== 0) {
      const bounds = new kakao.maps.LatLngBounds();
      let placePosition = new kakao.maps.LatLng(view.y, view.x);
      bounds.extend(placePosition);
      map.setBounds(bounds);
      removeMarker();
      const marker = drawMarker(placePosition, 0, undefined);
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
    
    kakao.maps.load(() => {
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
    const polyLine = new kakao.maps.Polyline({
      path: linePositions, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: '#050400', // 선의 색깔입니다
      strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: 'solid' // 선의 스타일입니다
    });
    setPolyLine(polyLine);
    polyLine.setMap(map);
  }

  const drawMarker = (position: any) => {
    const marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
      });
    setMarker(marker);
    
    marker.setMap(map); // 지도 위에 마커를 표출
    return marker;
  }

  const addMarker = (position: any, idx: number, title: undefined) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
        });
    
    
    marker.setMap(map); // 지도 위에 마커를 표출
    return marker;
  }

  const addPlanList = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    alert(`${view.place_name}이 경로에 추가되었습니다.`);
    dispatch(addPlan(view));
    closeInfoWindow();
  }

  const closeInfoWindow = () => {
    if(Object.keys(infoWindow).length !== 0) {
      infoWindow.close();
      setInfoWindow({});
    }
  }
  const close = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    closeInfoWindow();
  }

  const addMouseEvent = (marker: Object, view: Object) => {
    closeInfoWindow();

    let iwContent = createInfoWindow();

    const info = new kakao.maps.InfoWindow({
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
    link.href = view.place_url;
    link.textContent = view.place_name;
    container.appendChild(link);
    let br = document.createElement("br");
    container.appendChild(br);
    let address = document.createElement("div");
    address.className = styles.address;
    address.textContent = view.address_name;
    container.appendChild(address);
    container.appendChild(br);
    let addButton = document.createElement("button");
    addButton.id = "addButton"
    addButton.textContent = "경로에 추가";
    container.appendChild(addButton);
    let closeButton = document.createElement("button");
    closeButton.id = "closeButton"
    closeButton.textContent = "닫기";
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