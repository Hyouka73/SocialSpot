const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

exports.requestPasswordReset = async (req, res) => {
  try {
    console.log('Si llegó')
    const { email } = req.body;
    
    // 1. Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Generar token y fecha de expiración
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); // 1 hora exacta
    user.resetPasswordExpires = expireDate;
    await user.save();
    
    await user.save();

    // 3. Enviar email
    await sendPasswordResetEmail(user.email, token);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // 1. Buscar usuario por token válido
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // 2. Actualizar contraseña hasheada/encriptada
    const Pass = await bcrypt.hash(newPassword, 10);
    user.password = Pass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    // 3. Enviar confirmación (opcional)
    await sendPasswordResetEmail(
      user.email, 
      'Tu contraseña ha sido actualizada exitosamente.'
    );

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};