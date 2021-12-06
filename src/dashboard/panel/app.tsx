/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, {FC, useState, useEffect} from 'react';
import { useFormik } from 'formik';
import MasterList from "./utils/ref.json"
import './app.scss'

const currentVersusRep = nodecg.Replicant("keyPressRef")
const masterRefRep: any = nodecg.Replicant("MasterReference")

const app:FC = () => {
  const [MasterRef, setMasterRef] = useState("")
  useEffect(() => {
    const fetchMasterListInfo = async () =>{
			await NodeCG.waitForReplicants(masterRefRep)
			setMasterRef(masterRefRep.value)
		}
    fetchMasterListInfo() 
  }, [])
  const [BlueTeam, setBlueTeam] = useState<any>(MasterList[0])
  const [OrangeTeam, setOrangeTeam] = useState<any>(MasterList[1])
  
  console.log(MasterRef)
  function updateRep () {
    const blueArraycopy = Array.from(BlueTeam)
    const OrangeArraycopy = Array.from(OrangeTeam)
    const clamptofiveBlue = blueArraycopy.splice(0,5)  
    const clamptofiveOrange = OrangeArraycopy.splice(0,5)  
    const currentVersusArray = clamptofiveBlue.concat(clamptofiveOrange)
    console.log(currentVersusArray)
    currentVersusRep.value = currentVersusArray
  }

  function handleblueOnDragEnd(result) {
    const items = Array.from(BlueTeam);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBlueTeam(items);
  }

  function handleorangeOnDragEnd(result) {
    const items = Array.from(OrangeTeam);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrangeTeam(items);
  }

  const formik = useFormik({
     initialValues: {
       email: '',
     },
     onSubmit: values => {
       alert(JSON.stringify(values, null, 2));
     },
   });

  return (
    <div className='App'>
      <form className='player_form' onSubmit={formik.handleSubmit}>
       <label className='blue_team_player_label' htmlFor="Player1">Player 1</label>
       <input
         className="blue_team_player"
         name="player-1 name"
         type="text"
         onChange={formik.handleChange}
         value={formik.values.email}
       />
 
       <button className="submit_button" type="submit">Submit</button>
      </form>
      <div className='draggables'>
        {BlueTeam ?  
            <DragDropContext onDragEnd={handleblueOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                    {BlueTeam.map(({name, camera_index}, index) => (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <p>{name} {camera_index}</p>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
        : null}
        {OrangeTeam ?  
            <DragDropContext onDragEnd={handleorangeOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                    {OrangeTeam.map(({name, camera_index}, index) => (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                              <p>{name} {camera_index}</p>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
        : null}
      </div> 
      <button id='submitPhotos-button' type='button' onClick={updateRep}>ACTUALIZAR ORDEN DE CAMARAS</button>
    </div>
  );
};

export default app;
