"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {Rocket, Sparkles, Home, ArrowBigLeft} from "lucide-react";

export default function NotFoundPage() {
    const router = useRouter();

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-gray-900 text-white flex flex-col items-center justify-center p-6">
            {/* Estrellas decorativas */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <Sparkles
                        key={i}
                        className="text-yellow-200 absolute animate-pulse"
                        size={Math.random() * 10 + 5}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animationDuration: `${Math.random() * 5 + 3}s`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center relative z-10 max-w-2xl w-full"
            >
                {/* Número 404 animado */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-8"
                >
                    <motion.span
                        className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        404
                    </motion.span>
                </motion.div>

                {/* Título y descripción */}
                <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4">
                    ¡Houston, tenemos un problema!
                </motion.h1>
                <motion.p variants={itemVariants} className="text-xl mb-10 text-gray-300">
                    La página que buscas se ha perdido en el espacio o nunca existió.
                </motion.p>

                {/* Botones interactivos */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <button
                        onClick={() => router.push("/es/dashboard")}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-900
                        hover:bg-indigo-700 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg
                        cursor-pointer"
                    >
                        <Home/>
                        Volver al inicio
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600
                        hover:bg-purple-700 rounded-full transition-all duration-300 transform
                        hover:-translate-y-1 shadow-lg cursor-pointer"
                    >
                        <ArrowBigLeft />
                        Regresar atrás
                    </button>
                </motion.div>

                {/* Efecto de cohete */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="mt-16"
                >
                    <Rocket className="text-5xl mx-auto text-yellow-400" />
                </motion.div>
            </motion.div>

            {/* Efecto de partículas */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        </div>
    );
}