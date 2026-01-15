// Add some debugging and make vulnerabilities more obvious
import logger from '../logger.js';

console.log("🚨 SECURITY WARNING: This application has intentional vulnerabilities for testing!");
console.log("📧 Easy Admin Login: admin@admin.com / admin123");
console.log("🔓 Admin endpoints accessible without authentication");
console.log("💉 SQL injection enabled in login");
console.log("🎮 Score manipulation allowed");

// XSS testing endpoint
import express from 'express';
const vulnRouter = express.Router();
vulnRouter.use(express.json());

vulnRouter.post('/xss-test', (req, res) => {
    const { input } = req.body;
    const clientIP = req.ip || 'unknown';
    
    logger.security('XSS_TEST_ATTEMPTED', 'anonymous', { input, ip: clientIP });
    
    // DANGEROUS: No XSS protection!
    res.send(`<html><body><h1>Your input: ${input}</h1></body></html>`);
});

vulnRouter.get('/logs', (req, res) => {
    const clientIP = req.ip || 'unknown';
    logger.info('Logs accessed', { ip: clientIP });
    
    const recentLogs = logger.getRecentLogs(100);
    res.json({
        message: "Recent application logs",
        logs: recentLogs,
        timestamp: new Date().toISOString()
    });
});

vulnRouter.get('/debug', (req, res) => {
    res.json({
        message: "Debug endpoint - shows all vulnerabilities",
        vulnerabilities: [
            "SQL Injection in login",
            "No admin authentication",
            "XSS in forms", 
            "Score manipulation",
            "Session hijacking possible",
            "CSRF protection disabled"
        ],
        adminCredentials: {
            email: "admin@admin.com",
            password: "admin123"
        }
    });
});

export default vulnRouter;