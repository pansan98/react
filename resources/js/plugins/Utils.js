class Utils {
	constructor(){}

	dateformat(date, format) {
		if(typeof format === 'undefined') {
			format = 'yyyy年mm月dd日';
		}
		const d = new Date(date);

		format = format.replace(/yyyy/g, d.getFullYear());
		format = format.replace(/mm/g, (d.getMonth() + 1));
		format = format.replace(/dd/g, d.getDate());

		return format;
	}

	numberformat(number) {
		const formatter = new Intl.NumberFormat('ja-jp')
		return formatter.format(number)
	}
}

export default Utils;