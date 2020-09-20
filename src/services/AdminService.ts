/**
 * AdminService object.
 * handles business logic relating to AdminModel
 */
import { AdminModel } from "../models/admin";
import { IAdmin } from "../utils/types/custom";

const AdminService = {
	async createAdmin(data: IAdmin) {
		try {
			const admin = new AdminModel(data);
			await admin.save();

			return admin;
		} catch (error) {
			throw error;
		}
	},

	async getAdminByEmail(email: string) {
		try {
			const admin = await AdminModel.findOne({
				email,
			});
			return admin;
		} catch (error) {
			throw error;
		}
	},
};

export default AdminService;
