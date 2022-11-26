// 这是一个测试的配置文件，主要用来测试生成的代码
// 主要用来制定数据之间的关系

import dayjs from "dayjs";

export interface IConfigItem {
	name: string;
	init?: any;
	handle?: ( ...args: any[] ) => any;
	depend?: {
		names: string[]; handle?: ( ...args: any[] ) => any;
	};
}

export const RelationConfig: IConfigItem[] = [{
	name: "time",
	init: [dayjs().subtract(
		600,
		"seconds"
	).format( "YYYY-MM-DD HH:mm" ), dayjs().format( "YYYY-MM-DD HH:mm" )],
	depend: {
		names: ["shortcut"],
		handle( value ) {
			// console.log(
			// 	"time",
			// 	value
			// );
			return typeof value === "number" ? [dayjs().subtract(
				value,
				"seconds"
			).format( "YYYY-MM-DD HH:mm" ), dayjs().format( "YYYY-MM-DD HH:mm" )] : value;
		}
	},
}, {
	name: "shortcut",
	init: 600,
	depend: {
		names: ["time"],
		handle( value ) {
			// console.log(
			// 	"shortcut",
			// 	value
			// );
			// return shortcut;
			return value;
		}
	}
}, {
	name: "aggregation",
	init: 60,
	handle( value ) {
		return value;
	}
}];
