import fs from 'fs';
import path from 'path';

class Logger {
    constructor() {
        this.logDir = './logs';
        this.logFile = path.join(this.logDir, 'app.log');
        this.securityLogFile = path.join(this.logDir, 'security.log');
        this.errorLogFile = path.join(this.logDir, 'errors.log');
        
        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    // Get current timestamp
    getTimestamp() {
        return new Date().toISOString();
    }

    // Basic log levels
    info(message, data = null) {
        const logEntry = `[${this.getTimestamp()}] [INFO] ${message}`;
        const fullLog = data ? `${logEntry} | Data: ${JSON.stringify(data)}` : logEntry;
        
        console.log('ℹ️', fullLog);
        this.writeToFile(this.logFile, fullLog);
    }

    warning(message, data = null) {
        const logEntry = `[${this.getTimestamp()}] [WARNING] ${message}`;
        const fullLog = data ? `${logEntry} | Data: ${JSON.stringify(data)}` : logEntry;
        
        console.log('⚠️', fullLog);
        this.writeToFile(this.logFile, fullLog);
    }

    error(message, error = null) {
        const logEntry = `[${this.getTimestamp()}] [ERROR] ${message}`;
        const fullLog = error ? `${logEntry} | Error: ${error.message || error}` : logEntry;
        
        console.log('❌', fullLog);
        this.writeToFile(this.errorLogFile, fullLog);
        this.writeToFile(this.logFile, fullLog);
    }

    // Security specific logging
    security(event, user = 'unknown', details = null) {
        const logEntry = `[${this.getTimestamp()}] [SECURITY] Event: ${event} | User: ${user}`;
        const fullLog = details ? `${logEntry} | Details: ${JSON.stringify(details)}` : logEntry;
        
        console.log('🔒', fullLog);
        this.writeToFile(this.securityLogFile, fullLog);
        this.writeToFile(this.logFile, fullLog);
    }

    // Login attempts
    loginAttempt(email, success, ip = 'unknown') {
        const status = success ? 'SUCCESS' : 'FAILED';
        this.security(`LOGIN_${status}`, email, { ip, timestamp: this.getTimestamp() });
    }

    // Database operations
    database(operation, table, user = 'system') {
        this.info(`Database operation: ${operation} on table ${table}`, { user });
    }

    // Write to file
    writeToFile(filename, content) {
        try {
            fs.appendFileSync(filename, content + '\n');
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    // Get recent logs
    getRecentLogs(lines = 50) {
        try {
            const data = fs.readFileSync(this.logFile, 'utf8');
            const logLines = data.split('\n').filter(line => line.trim() !== '');
            return logLines.slice(-lines);
        } catch (error) {
            return ['No logs found'];
        }
    }
}

// Export singleton instance
const logger = new Logger();
export default logger;