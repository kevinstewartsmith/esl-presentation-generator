import React, { useEffect, useState, useContext } from "react";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "./container";
import { Item } from "./sortable_item";
//import { Padding } from "@mui/icons-material";
import { PresentationContext } from "@app/contexts/PresentationContext";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
  marginLeft: 200,
  marginRight: 200,
};

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  },
};

export default function StageSorter({ lessonID }) {
  const { stages, updateStages } = useContext(PresentationContext);
  const { loggedInUser } = useContext(GlobalVariablesContext);
  const [items, setItems] = useState({
    root: ["Class Rules", "Effort and Attitude Score", "Warm-Up: Speaking"],
    container1: [
      "Warm-Up: Board Race",
      "Reading For Gist and Detail",
      "Listening for Gist and Detail",
      "Advantages - Disadvantages",
      "Brainstorming",
      "Speaking: Debate",
      "Writing: Essay",
      "Speaking: Role Play",
      "Speaking: Presentation",
      "Speaking: Survey",
    ],
    // container2: ["7", "8", "9"],
    // container3: [],
  });

  useEffect(() => {
    console.log("Items: ");
    console.log(items);
    function postStagesToDB() {
      try {
        const stages = JSON.stringify(items);
        const response = fetch(
          `/api/firestore/post-stages?userID=${loggedInUser}&lessonID=${lessonID}&stages=${stages}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //body: JSON.stringify(items),
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
    postStagesToDB();
  }, [items]);

  const [activeId, setActiveId] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div style={wrapperStyle}>
      <DndContext
        announcements={defaultAnnouncements}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Container id="root" items={items.root} />
        <Container id="container1" items={items.container1} />
        {/* <Container id="container2" items={items.container2} />
        <Container id="container3" items={items.container3} /> */}
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );

  function findContainer(id) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;
    console.log(event);
    console.log("OVER: ");
    console.log(over);
    console.log("DRAGGING RECT: ");
    console.log(draggingRect);

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        // const isBelowLastItem =
        //   over &&
        //   overIndex === overItems.length - 1 &&
        //   draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          over.rect.top + over.rect.height / 2 < window.innerHeight;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  }
}
