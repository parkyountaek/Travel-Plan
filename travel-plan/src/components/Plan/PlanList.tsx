import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import Paper from '@mui/material/Paper';
import styles from "../../../styles/Plan.module.css";


const PlanList = () => {
  const [itemList, setItemList] = useState<Object[]>([]);
  const node = useSelector((state: RootState) => state.plan.node);
  const mapLoaded = useSelector((state: RootState) => state.kakaoMap.loaded);


  useEffect(() => {
    setItemList(node);
  }, [node]);


  const handleDrop = (droppedItem: Object) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...itemList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemList(updatedList);
  };

  return (
    <>
      {/* <Paper className={styles.planList}> */}
        <div className={styles.title}>📄 선택된 경로 목록</div>
        <hr />
        { mapLoaded.toString() }
        
      {/* </Paper> */}
    </>
  )
};

export default PlanList;