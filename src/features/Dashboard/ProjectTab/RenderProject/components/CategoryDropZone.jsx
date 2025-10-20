import { getFileIcon } from "../utils/extensionMap";
import { X } from 'lucide-react';

const CategoryDropZone = ({ category, existingFiles, dragOverCategory, draggedFile, canDropInCategory, onDragOver, onDragLeave, onDrop, onRemoveFile }) => {
    const filesInCategory = existingFiles.filter(file => file.category?.id === category.id);
    const isDropTarget = dragOverCategory === category.id && draggedFile && canDropInCategory(draggedFile, category);
    
    const CategoryFile = ({ file }) => {
        const { icon: FileIcon, color, bgColor } = getFileIcon(file.filename);
        return (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg group">
                <div className={`w-6 h-6 ${bgColor} rounded flex items-center justify-center`}>
                    <FileIcon className={`w-3 h-3 ${color}`} />
                </div>
                <span className="text-sm text-foreground truncate flex-1">{file.filename}</span>
                <button
                    onClick={() => onRemoveFile(file.id)}
                    className="text-red-400 text-lg hover:text-red-300 p-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    };

    const EmptyState = ({ message }) => (
        <div className="text-center text-muted-foreground text-sm py-4">
            {message}
        </div>
    );

    return (
        <div
            onDragOver={(e) => onDragOver(e, category.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, category)}
            className={`p-4 rounded-lg border bg-elem transition-all min-h-[200px] max-h-[250px] overflow-y-scroll no-scrollbar ${isDropTarget ? `${category.borderColor} ${category.bgColor}` : 'border-border'}`}
        >
            <div className="flex items-center gap-2 mb-3">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <h4 className="font-medium text-foreground">{category.name}</h4>
                <span className="text-xs text-muted-foreground">
                    ({category.allowedTypes.join(', ').toUpperCase()})
                </span>
            </div>

            {category.inputType === 'list' ? (
                <div className="space-y-2">
                    {filesInCategory.map(file => (
                        <CategoryFile key={file.id} file={file} />
                    ))}
                    {filesInCategory.length === 0 && (
                        <EmptyState message={`Drag ${category.name} files here`} />
                    )}
                </div>
            ) : (
                <div>
                    {filesInCategory.length > 0 ? (
                        <CategoryFile file={filesInCategory[0]} />
                    ) : (
                        <EmptyState message={`Drag a ${category.name} file here`} />
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryDropZone