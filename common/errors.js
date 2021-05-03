const tokenInvalidOrMissing = response => {
    response.status(401).json({ error: 'Token missing or invalid' })
}

module.exports = { tokenInvalidOrMissing }
