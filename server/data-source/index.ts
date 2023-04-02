import { DataSource } from 'typeorm';

import { join } from 'path';

export const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'shortLink',
    entities: [join(__dirname, '../entity', '/**.{js,ts}')],
    synchronize: true,
});
