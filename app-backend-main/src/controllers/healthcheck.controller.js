const healthcheck = (req, res) => {
    try {
        res.status(200).json({
            ok: true,
            message: "Service is healthy"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Service is unhealthy",
            error: error.message
        });
    }
};

export { healthcheck };
