import {ConfigType} from "../type";

const {
    NODE_ENV,
    PORT,
    DOMAIN,
    PUBLIC_URL,
    TEAMS_URL,
    SLACK_URL,
    BASIC_AUTH_USER,
    BASIC_AUTH_PASSWORD,
    BASIC_AUTH_REALM,
} = process.env as any

export const Config: ConfigType = {
    nodeEnv: NODE_ENV,
    port: Number(PORT),
    domain: DOMAIN || '',
    publicUrl: PUBLIC_URL || '',
    teamsUrl: TEAMS_URL,
    slackUrl: SLACK_URL,
    basicAuthUser: BASIC_AUTH_USER,
    basicAuthPassword: BASIC_AUTH_PASSWORD,
    basicAuthRealm: BASIC_AUTH_REALM,
}

