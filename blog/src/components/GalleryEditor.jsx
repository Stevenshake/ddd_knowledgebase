import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './GalleryEditor.css';

const SortableImage = ({ image, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-image" {...attributes} {...listeners}>
      <img src={image.url} alt={image.alt || 'Gallery image'} />
      <button 
        type="button" 
        className="remove-btn" 
        onClick={() => onRemove(image.id)}
      >
        ×
      </button>
      <div className="drag-handle">⋮⋮</div>
    </div>
  );
};

const GalleryEditor = ({ images = [], onChange }) => {
  const [gallery, setGallery] = useState(images.map((img, idx) => ({
    id: img.id || `img-${idx}-${Date.now()}`,
    url: img.url,
    alt: img.alt || '',
  })));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setGallery((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onChange(newOrder);
        return newOrder;
      });
    }
  };

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      file: file,
      alt: file.name,
    }));
    
    const updatedGallery = [...gallery, ...newImages];
    setGallery(updatedGallery);
    onChange(updatedGallery);
  }, [gallery, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    const newImages = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      file: file,
      alt: file.name,
    }));
    
    const updatedGallery = [...gallery, ...newImages];
    setGallery(updatedGallery);
    onChange(updatedGallery);
  }, [gallery, onChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeImage = useCallback((id) => {
    const updatedGallery = gallery.filter(img => img.id !== id);
    setGallery(updatedGallery);
    onChange(updatedGallery);
  }, [gallery, onChange]);

  return (
    <div className="gallery-editor">
      <div 
        className="gallery-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label className="file-input-label">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="file-input"
          />
          <span className="drop-zone-text">
            Перетащите изображения сюда или нажмите для выбора
          </span>
        </label>
      </div>

      {gallery.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={gallery.map(img => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="gallery-preview">
              {gallery.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default GalleryEditor;
