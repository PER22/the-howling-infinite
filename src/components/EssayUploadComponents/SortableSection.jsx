import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionForm from './SectionForm';
import IconButton from '@mui/material/IconButton';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';



// Separate component for a sortable section
export default function SortableSection({ id, section, index, updateSectionData, removeSection }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        
    };

    return (
        <div className="sortable-section-container card" ref={setNodeRef} style={style}>
            <IconButton {...attributes} {...listeners}>
                <VerticalAlignCenterIcon />
            </IconButton>
            <SectionForm
                id={id}
                section={section}
                index={index}
                updateSectionData={updateSectionData}
                removeSection={removeSection}
            />

        </div>
    );
}

