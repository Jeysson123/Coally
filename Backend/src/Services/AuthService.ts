import jwt from 'jsonwebtoken';

class AuthService {

  public generateToken(payload: object): string {

    const secret = process.env.JWT_SECRET || '567312949ee76deb7fffc2db1daa46a5588df356e73447df411cffa5461190532e611e310a1d8173de5d1b4f67c0a1af5a4b52883a7f19650dbff7003916b97c'; // Use a secret key for encoding the token
    
    const expiresIn = '1h';
    
    const token = jwt.sign(payload, secret, { expiresIn });
    
    return token;
  }
}

export default new AuthService();
