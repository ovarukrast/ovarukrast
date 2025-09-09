export interface EmailData {
    studentName: string;
    teacherEmail: string;
    activityName: string;
    score: number;
    totalQuestions: number;
}

/**
 * Simula el envío de un correo electrónico con los resultados del estudiante al profesor.
 * En una aplicación real, esto haría una llamada a una API de un servicio de backend.
 */
export const sendResultsEmail = async (data: EmailData): Promise<{ success: boolean; message: string }> => {
    console.log("Simulando el envío de correo con los siguientes datos:", data);

    // Validación básica
    if (!data.studentName || !data.teacherEmail || !data.activityName) {
        return { success: false, message: "Falta información requerida." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.teacherEmail)) {
        return { success: false, message: "Formato de correo electrónico no válido." };
    }

    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    // En una aplicación real, aquí se manejarían los posibles errores del backend.
    // Por ahora, asumiremos que siempre tiene éxito.
    console.log(`Correo enviado con éxito a ${data.teacherEmail}`);
    return { success: true, message: "¡Resultados enviados con éxito!" };
};
