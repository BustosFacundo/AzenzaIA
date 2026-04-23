import React from "react";
import { useState, useRef } from "react";
import { DropZone } from  '../components/DropZone';
import { useNavigate } from "react-router-dom";

export function Analisis() {
    const [problem, setProblem] = useState('');
    const [diff, setDiff] = useState('');
    const [target, setTarget] = useState('');
    const [image, setImage] = useState(null); // Para el preview
    const [imageFile, setImageFile] = useState(null); // Para el FormData

    const navigate = useNavigate();

    const handleImageChange = (dataUrl, file) => {
        setImage(dataUrl);
        setImageFile(file);
    };

    const handleSubmit = async () => {
        // Validar
        if (!problem.trim() || !diff.trim() || !target.trim()) {
            alert('Por favor completá los 3 campos de texto.');
            return;
        }
        if (!imageFile) {
            alert('Por favor subí una imagen de tu perfil.');
            return;
        }

        // Armar FormData
        const formData = new FormData();
        formData.append('problem', problem);
        formData.append('diff', diff);
        formData.append('target', target);
        formData.append('image', imageFile);

        // Navegar a loading y llamar al backend
        navigate('/loading');

        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error del servidor');
            }

            const data = await response.json();

            // Navegar a resultados con los datos
            navigate('/results', { state: { results: data } });

        } catch (error) {
            // Navegar a error con el mensaje
            navigate('/error', { state: { mensaje: error.message } });
        }
    };

    
    return (
        <div id="analisis-container">
            <div id="titulo-analisis">
                <h1 className='text-gradient'>Azenza IA</h1>
                <p id='subtitulo-analisis'>Auditoría de marca inteligente. Comparamos tu estrategia interna con lo que realmente proyecta tu perfil</p>
            </div>

            <div id='area-formulario'>
                <div 
                    id='form-estrategia'
                    className="glass-panel p-4 rounded-3 shadow-sm"
                >
                    <h2 className="h5 text-white mb-3">
                        <i className="fas fa-bullseye text-purple me-2"></i>Tu estrategia
                    </h2>
                    <p className='small mb-4'>
                        Define tu marca para que la IA contraste tu intención con la realidad
                    </p>

                    <form action="" className='mb-3'>
                        <label
                            htmlFor="campo-problema"
                            className='form-label text-white small'
                        >
                            1. ¿Qué problema resuelves?
                        </label>
                        <textarea
                            id='campo-problema'
                            rows='2'
                            className='form-control tech-input'
                            placeholder="Ej: Ayudo a pymes a automatizar sus ventas…"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                        />
                        
                        <label
                            htmlFor="campo-diferenciacion"
                            className='form-label text-white small'
                        >
                            2. ¿Qué te diferencia?
                        </label>
                        <textarea
                            id='campo-diferenciacion'
                            rows='2'
                            className='form-control tech-input'
                            placeholder="Ej: Usamos IA personalizada, no plantillas genéricas…"
                            value={diff}
                            onChange={(e) => setDiff(e.target.value)}
                        />

                        <label
                            htmlFor="campo-publico"
                            className='form-label text-white small'
                        >
                            3. ¿Cuál es tu público objetivo?
                        </label>
                        <textarea
                            id='campo-publico'
                            rows='2'
                            className='form-control tech-input'
                            placeholder="Ej: Dueños de restaurantes de lujo…"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        />
                    </form>
                </div>

                <div 
                    id='drag-and-drop'
                    className='glass-panel p-4 rounded-3 shadow-sm'
                >
                    <h2 className='h5 text-white mb-3'>
                        <i className='fas fa-image text-purple me-2'></i>Tu perfil
                    </h2>
                    <DropZone image={image} onImageChange={handleImageChange} />
                </div>
            </div>

            <button id='btn-enviar-diagnostico' onClick={handleSubmit}>
                Ejecutar diagnóstico <i className='fas fa-bolt group-hover:animate-pulse'></i>
            </button>
        </div>
    );
}
