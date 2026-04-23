import { useState, useRef } from "react";

export function DropZone({ image, onImageChange }) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef(null);

    // Funcion para procesar la imagen
    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('El archivo subido no es una imagen')
            return;
        }

        const reader = new FileReader();
        reader.onload = () => onImageChange(reader.result, file);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };
    
    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    return (
        <>
            <div
                id="drop-zone"
                onClick={handleClick} 
                onDragOver={!image ? handleDragOver : undefined}
                onDragLeave={!image ? handleDragLeave : undefined}
                onDrop={!image ? handleDrop : undefined}
                className={`${isDragging ? 'drag-over' : ''}`}
            >
                {!image ? (
                    <>
                        <div className="mb-4">
                            <i className="fas fa-cloud-upload-alt drop-zone-icon"></i>
                        </div>
                        <p id="texto-drop-zone">Sube tu imagen aquí</p>
                        <p className="text-secondary">Perfil de Instagram o Facebook</p>
                    </>
                ) : (
                    <img
                        id='img-prev'
                        src={image} 
                        alt="Preview" 
                    />
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleInputChange}
            />

            {image && (
                <button 
                    id='boton-eliminar' 
                    className='btn btn-danger' 
                    onClick={() => onImageChange(null, null)}
                >
                    Eliminar imagen
                </button>
            )}
        </>
    )
}