const authService = require("../services/auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;

      const data = await authService.register(fullName, email, password);
      console.log(data, '<---auth controller data');

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });


      return res.status(201).json(data);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(400).json({ message: error.message || 'Registration failed' });
    }
  }


  async login(req, res, next) {

    try {
      console.log('started');

      const { email, password } = req.body;
      const data = await authService.login(email, password);


      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });


      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res, next) {
    try {
      const { userId } = req.body;
      const { message } = await authService.logout(userId);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async activation(req, res, next) {
    try {
      const token = req.params.token;
      await authService.activation(token);

      res.redirect(process.env.CLIENT_URL);
      // res.json({ success: true })
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async forgatPassword(req, res, next) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async recoverAccount(req, res, next) {
    try {
      const { token, password } = req.body;
      await authService.recoverAccount(token, password);
      res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async resendLink(req, res, next) {
    try {
      const { email, link } = req.body;

      const resend = await authService.resendLink(email);
      res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) throw new Error('refresh token is missing')

      const data = await authService.refresh(refreshToken);
      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
