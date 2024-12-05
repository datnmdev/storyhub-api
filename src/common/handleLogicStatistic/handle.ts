import moment from 'moment';
export const calculate = (invoices: any[]): any[] => {
	return invoices.map((invoice) => ({
		createdAt: moment(invoice.createdAt).format('YYYY-MM-DD'),
		totalAmount: parseInt(invoice.totalAmount, 10),
	}));
};

// Hàm để tính tổng `totalAmount` theo ngày, tháng hoặc năm và trừ 10% sau khi sắp xếp
export const calculateTotalByType = (data: any[], type: number): any[] => {
	const result: any[] = [];

	// Dựa vào `type` để xử lý tính tổng
	data.forEach((item) => {
		let period = '';
		switch (type) {
			case 0: // Theo ngày
				period = moment(item.createdAt).format('YYYY-MM-DD'); // Dùng Moment để format ngày
				break;
			case 1: // Theo tháng
				period = moment(item.createdAt).format('YYYY-MM'); // Dùng Moment để lấy tháng (YYYY-MM)
				break;
			case 2: // Theo năm
				period = moment(item.createdAt).format('YYYY'); // Dùng Moment để lấy năm (YYYY)
				break;
			default:
				return;
		}

		// Kiểm tra nếu period đã tồn tại trong kết quả, thì cộng thêm totalAmount và trừ 10%
		const existingPeriod = result.find((r) => r.createdAt === period);
		if (existingPeriod) {
			existingPeriod.totalAmount += item.totalAmount * 0.9; // Trừ 10%
		} else {
			result.push({ createdAt: period, totalAmount: item.totalAmount * 0.9 }); // Trừ 10%
		}
	});

	// Sắp xếp kết quả theo createdAt tăng dần
	return result.sort(
		(a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);
};
