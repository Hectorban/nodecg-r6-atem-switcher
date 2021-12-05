/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {FC, useState} from 'react';
import { Formik, Field, Form } from 'formik';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MasterList from './json/ref.json'
import './app.scss'

const currentVersusRep = nodecg.Replicant("keyPressRef")

interface cameraArray {
    name:  string
    camera_index: number
}

const app:FC = () => {
  const [BlueTeam, setBlueTeam] = useState<any>(MasterList)
  const [OrangeTeam, setOrangeTeam] = useState<any>(MasterList)

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

  return (
    <div className='App'>
      <div className='draggables'>
        {BlueTeam ?  
            <DragDropContext onDragEnd={handleblueOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                    {BlueTeam.map(({name}, index) => (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <p>{name}</p>
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
                    {OrangeTeam.map(({name}, index) => (
                        <Draggable key={name} draggableId={name} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                              <p>{name}</p>
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
      <button id='submitPhotos-button' type='button' onClick={updateRep}>ACTUALIZAR FOTOS</button>
    </div>
  );
};

export default app;
