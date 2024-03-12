import bcrypt from 'bcryptjs';

export const hash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
export const unHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}