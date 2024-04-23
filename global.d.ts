export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            USER_NAME: string;
            PASSWORD: string;
        }
    }
}