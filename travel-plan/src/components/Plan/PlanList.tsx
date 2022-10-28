import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import Paper from '@mui/material/Paper';
import styles from "../../../styles/Plan.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { setPlan } from "../../../redux/planSlice";
import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import IconButton from '@mui/material/IconButton';
import { setViewBounds } from "../../../redux/kakaoMapSlice";

const PlanList = () => {
  const [itemList, setItemList] = useState<Object[]>([]);
  const node = useSelector((state: RootState) => state.plan.node);
  const mapLoaded = useSelector((state: RootState) => state.kakaoMap.loaded);

  const dispatch = useDispatch();

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
    dispatch(setPlan(updatedList));
  };

  const remove = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: String)=> {
    e.preventDefault();
    const updateList = itemList.filter(item => item.id !== id);
    setItemList(updateList);
    dispatch(setPlan(updateList));
  }

  const setBounds = ()=> {
    dispatch(setViewBounds(true));
  }

  return (
    <>
      <Paper className={styles.planList}>
        <div className={styles.titleContainer}>
          <h3>📄 선택된 경로 목록</h3>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={setBounds}>
            <FullscreenIcon />
          </IconButton>
        </div>
        <hr />
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div className={styles.wrap}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {itemList.map((item, index) => (
                  
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Card sx={{ minWidth: 275 }} className={styles.listContainer}>
                        <CardContent>
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <li className={styles.placeName}>{index+1}.{item.place_name}</li>
                            <li className={styles.addressName}>{item.address_name}</li>
                            <Button variant="contained" onClick={(e) => remove(e, item.id)}>삭제</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                    
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </>
  )
};

export default PlanList;