import jwt from 'jsonwebtoken';

const generateToken =(email,username)=> {
    return jwt.sign({email,username}, 'fcbarcelona' ,{algorithm:'HS256',expiresIn:'1h'})
}

const validateToken = (token)=> {
    return jwt.verify(token, 'fcbarcelona')
}

export {generateToken, validateToken}