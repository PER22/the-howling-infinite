import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SectionForm from './SectionForm';
import { Button } from '@mui/material';

function SectionList({ sections, setSections, updateSectionData, removeSection, addSection }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
    );

    const [activeId, setActiveId] = useState(null);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = sections.findIndex(section => section.id === active.id);
            const newIndex = sections.findIndex(section => section.id === over.id);
            setSections(arrayMove(sections, oldIndex, newIndex));
        }

        setActiveId(null);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
                {sections.map((section, index) => (
                    <SectionForm
                        key={section.id}
                        id={section.id}
                        _id={section._id}
                        section={section}
                        index={index}
                        updateSectionData={updateSectionData}
                        removeSection={removeSection}
                    />
                ))}
            </SortableContext>
            <DragOverlay>
                {activeId ? (
                    <SectionForm
                        id={activeId}
                        section={sections.find(section => section.id === activeId)}
                        updateSectionData={updateSectionData}
                        removeSection={removeSection}
                    />
                ) : null}
            </DragOverlay>
            <Button onClick={() => addSection('Chapter')}>Add Chapter</Button>
            <Button onClick={() => addSection('Interlude')}>Add Interlude</Button>
        </DndContext>
    );
}

export default SectionList;
