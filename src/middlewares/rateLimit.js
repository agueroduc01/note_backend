// Store the number of requests per IP address
const requestCounts = {};

// Set the limit of requests per time window
const limit = 100;

// Set the time window in milliseconds
const timeWindow = 60000;

// Define the middleware function to handle rate limiting
const handleRateLimit = (req, res, next) => {
    // Get the IP address of the request
    const ip = req.ip;

    // Check if the IP address has reached the limit
    if (requestCounts[ip] && requestCounts[ip].count >= limit) {
        // Check if the time window has expired
        const elapsedTime = Date.now() - requestCounts[ip].time;
        if (elapsedTime < timeWindow) {
            return res.status(429).send('Too Many Requests');
        } else {
            // Reset the count if the time window has expired
            requestCounts[ip].count = 0;
            requestCounts[ip].time = Date.now();
        }
    } else {
        // Initialize the count if it doesn't exist
        requestCounts[ip] = {
            count: 1,
            time: Date.now()
        };
    }

    // Increment the count
    requestCounts[ip].count++;

    // Call the next middleware function
    next();
};

export default handleRateLimit;
