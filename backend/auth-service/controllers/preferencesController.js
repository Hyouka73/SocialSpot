const User = require('../models/user');

exports.createPreferences = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { preferences, notifications, darkMode } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        if (user.preferences) {
            return res.status(400).json({ 
                msg: 'El usuario ya tiene preferencias establecidas. Use PUT /preferences/:userId para actualizar.' 
            });
        }

        user.preferences = preferences || {
            favoritePlaceTypes: [],
            interests: [],
            priceRange: 'medio',
            frequency: '1-2 veces por semana',
            preferredTime: 'afternoon',
            travelDistance: 10
        };

        user.notifications = notifications !== undefined ? notifications : true;
        user.darkMode = darkMode !== undefined ? darkMode : false;
        
        await user.save();
        
        res.status(201).json({
            msg: 'Preferencias iniciales creadas',
            preferences: user.preferences,
            notifications: user.notifications,
            darkMode: user.darkMode
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { preferences, notifications, darkMode } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        if (!user.preferences) {
            return res.status(400).json({ 
                msg: 'El usuario no tiene preferencias establecidas. Use POST /create-preferences/:userId para crearlas.' 
            });
        }

        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }
        
        if (notifications !== undefined) user.notifications = notifications;
        if (darkMode !== undefined) user.darkMode = darkMode;
        
        await user.save();
        
        res.json({
            msg: 'Preferencias actualizadas',
            preferences: user.preferences,
            notifications: user.notifications,
            darkMode: user.darkMode
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, 'preferences notifications darkMode');
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        if (!user.preferences) {
            return res.status(404).json({ msg: 'El usuario no tiene preferencias establecidas' });
        }

        res.json({
            preferences: user.preferences,
            notifications: user.notifications,
            darkMode: user.darkMode
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
