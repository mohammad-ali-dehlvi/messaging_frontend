import { config } from 'dotenv';
import { createClient } from '@hey-api/openapi-ts'

config();

createClient({
    input: process.env.REACT_APP_BACKEND_URL as string,
    output: 'src/client',
    enums: 'typescript'
    // plugins: ['@hey-api/client-axios', { asClass: true, name: '@hey-api/sdk', }],
});