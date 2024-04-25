export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            USER_NAME: string;
            PASSWORD: string;
            URL: string;
            UNIQUESCREENSHOTS: string;
        }
    }
}