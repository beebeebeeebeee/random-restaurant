export type ConfigType = {
    nodeEnv: 'development' | 'production';
    port: number;
    domain: string;
    publicUrl: string;
    teamsUrl: string;
    slackUrl: string;
    basicAuthUser: string;
    basicAuthPassword: string;
    basicAuthRealm: string;
}