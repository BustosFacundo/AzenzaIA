import React from "react";
import { useState, useRef, useEffect } from "react";
import { DropZone } from  '../components/DropZone';
import { useNavigate } from "react-router-dom";

export function Analisis() {
    const [problem, setProblem] = useState('');
    const [diff, setDiff] = useState('');
    const [target, setTarget] = useState('');
    const [image, setImage] = useState(null); // Para el preview
    const [imageFile, setImageFile] = useState(null); // Para el FormData
    const API_URL = import.meta.env.VITE_BACKEND_URL

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

        if (problem.length > 150 || diff.length > 150 || target.length > 150) {
            alert("Los campos de texto no pueden superar los 150 caracteres.");
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
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const responseText = await response.text();
                console.log("Openai raw response:", responseText);
                throw new Error("Error en la respuesta");
            }

            const data = await response.json();

            // Navegar a resultados con los datos
            navigate('/results', { state: { results: data } });

        } catch (error) {
            // Navegar a error con el mensaje
            navigate('/error', { state: { mensaje: error.message } });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div id="analisis-container">
            <div id="titulo-analisis">
                <h1 className='text-gradient reveal'>Azenza IA</h1>
                <p id='subtitulo-analisis' className="reveal">Auditoría de marca inteligente. Comparamos tu estrategia interna con lo que realmente proyecta tu perfil</p>
            </div>

            <div id='area-formulario'>
                <div 
                    id='form-estrategia'
                    className="glass-panel p-4 rounded-3 shadow-sm reveal"
                >
                    <h2 className="h5 text-white mb-3">
                        <i className="fas fa-bullseye text-purple me-2"></i>Tu estrategia
                    </h2>

                    <form id="campos-form" action="" className='mb-3'>
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
                            maxLength={150}
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                        />
                        <small className={problem.length >= 150 ? 'warning' : "contador-campo"}>
                            {problem.length}/150 caracteres
                        </small>

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
                            maxLength={150}
                            value={diff}
                            onChange={(e) => setDiff(e.target.value)}
                        />
                        <small className={diff.length >= 150 ? 'warning' : "contador-campo"}>
                            {diff.length}/150 caracteres
                        </small>

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
                            maxLength={150}
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        />
                        <small className={target.length >= 150 ? 'warning' : "contador-campo"}>
                            {target.length}/150 caracteres
                        </small>
                    </form>
                </div>

                <div 
                    id='drag-and-drop'
                    className='glass-panel p-4 rounded-3 shadow-sm reveal'
                >
                    <h2 className='h5 text-white mb-3'>
                        <i className='fas fa-image text-purple me-2'></i>Tu perfil
                    </h2>
                    <DropZone image={image} onImageChange={handleImageChange} />
                </div>
            </div>

            <button id='btn-enviar-diagnostico' onClick={handleSubmit} className="reveal">
                Ejecutar diagnóstico <i className='fas fa-bolt group-hover:animate-pulse'></i>
            </button>
        </div>
    );
}
