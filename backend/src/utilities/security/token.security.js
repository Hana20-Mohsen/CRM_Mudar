import jwt from 'jsonwebtoken'

export const generateToken=({payload={} , signature=process.env.TOKEN_SIGNATURE , options={}})=>{
    console.log('signature :' , signature);
    
    const token = jwt.sign(payload , signature , options)
    return token

}

export const verifyToken=({token='' , signature=process.env.TOKEN_SIGNATURE})=>{
    console.log(`we use signature: `, signature);
    
    const decoded= jwt.verify(token , signature)
    return decoded

}