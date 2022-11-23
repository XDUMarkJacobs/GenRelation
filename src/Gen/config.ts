// 这是一个测试的配置文件，主要用来测试生成的代码
// 主要用来制定数据之间的关系

import dayjs from 'dayjs';

export interface IConfigItem {
    name: string;
    init?: any;
    handle?: ( ...args: any[] ) => any;
    depend?: {
        names: string[];
        handle?: ( ...args: any[] ) => any;
    };
}

export const RelationConfig: IConfigItem[] = [
    {
        name: 'shortcut',
        init: 600,
    },
    {
        name: 'time',
        init: 600,
        handle ( time ) {
            return [dayjs().subtract( time, 'seconds' ).format( 'YYYY-MM-DD HH:mm' ), dayjs().format( 'YYYY-MM-DD HH:mm' )];
        },
        depend: {
            names: ['shortcut'],
            handle ( [time, shortcut] ) {
                return [dayjs().subtract( shortcut, 'seconds' ).format( 'YYYY-MM-DD HH:mm' ), dayjs().format( 'YYYY-MM-DD HH:mm' )];
            }
        },
    },
    {
        name: 'aggregation',
        init: 60,
        handle ( value ) {
            return value;
        }
    }
];