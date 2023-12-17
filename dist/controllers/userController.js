import User from '../models/userModel.js';
const getCurrentUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        if (!id)
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        const user = await User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
export default {
    getCurrentUser,
};
