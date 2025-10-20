import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { getFileIcon } from '../utils/extensionMap';

// Extract components for better organization
const FileItem = ({ file, onDownload, onDelete, isDraggable = false, onDragStart, onDragEnd, draggedFile }) => {
    const { icon: FileIcon, color, bgColor } = getFileIcon(file.filename);
    const isBeingDragged = draggedFile?.id === file.id;
    
    return (
        <div
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted transition-all ${
                isDraggable ? 'cursor-move' : ''
            } ${isBeingDragged ? 'opacity-50' : ''}`}
        >
            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                <FileIcon className={`w-5 h-5 ${color}`} />
            </div>
            <span className={`font-medium truncate flex-1 ${
                isDraggable ? 'text-foreground' : 'text-muted-foreground'
            }`}>
                {file.filename}
            </span>
            
            {onDownload && onDelete && (
                <div className="flex">
                    <button
                        onClick={() => onDownload(file.filename)}
                        className="text-green-500 p-3 rounded-lg hover:text-white hover:bg-green-500"
                    >
                        <Download />
                    </button>
                    <button
                        onClick={() => onDelete(file.filename)}
                        className="text-red-500 p-3 rounded-lg hover:text-white hover:bg-red-500"
                    >
                        <Trash2 />
                    </button>
                </div>
            )}
        </div>
    );
};
export default FileItem;