import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import Paper from '@mui/material/Paper';


const PlanList = () => {
  const [itemList, setItemList] = useState<Object[]>([]);

  const node = useSelector((state: RootState) => state.plan.node);

  useEffect(() => {
    setItemList(node);
  }, [node]);


  
  
  return (
    <>
      <Paper>
        {itemList.map(item => <div>{item.place_name}</div>)}
      </Paper>
    </>
  )
};

export default PlanList;