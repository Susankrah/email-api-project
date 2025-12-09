
import { parentPort, workerData } from "worker_threads";

// Mocking email service - will replace later with kelvin's service when ready
async function mockSendEmail(emailId: string): Promise<boolean> {
    console.log(`[Worker] Processiing email ${emailId}`);

    // Simualte processing time (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    // Simulate 90% success rate
    const isSuccess = Math.random() < 0.9;
    
    if (!isSuccess) {
        throw new Error('Mock email service: Failed to send email');
    }

    return true ;
}

async function processEmail() {
    try {
        const { emailId } = workerData;
        await mockSendEmail(emailId);

        parentPort?.postMessage({
            success: true,
            emailId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        parentPort?.postMessage({
            success: false,
            error: error.message,
            emailId: workerData.emailId
        });
    }
}

processEmail();   

        

        


