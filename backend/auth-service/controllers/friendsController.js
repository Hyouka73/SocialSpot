const User = require('../models/user');

exports.addFriend = async (req, res) => {
    const { friendId } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const friend = await User.findById(friendId);
        if (!friend) return res.status(404).json({ msg: 'Amigo no encontrado' });

        user.friends.push({ userId: friendId, addedAt: new Date() });
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
