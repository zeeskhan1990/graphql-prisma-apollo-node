import bcrypt from 'bcryptjs'

const hashPassword = async (password) => {
    if(password.length < 8) {
        throw new Error("min length password should be 8")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export default hashPassword