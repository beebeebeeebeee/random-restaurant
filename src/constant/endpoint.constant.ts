export enum ApiEndpointConstant {
    ALERT_GET = "/alertId/:alertId",
    ALERT_UPDATE = "/alertId/:alertId",
    ALERT_TRIGGER = "/trigger/alertId/:alertId",
    BOARD_CREATE = "/boardId/:boardId",
    BOARD_GET = "/boardId/:boardId",
    RESTAURANT_UPDATE = "/id/:id",
    RESTAURANT_DELETE = "/id/:id",
}

export enum ViewEndpointConstant {
    ROOT = "/",
    ALERT_VIEW = "/config/alertId/:alertId",
    BOARD_DRAW = "/boardId/:boardId/seed/:seed/timestamp/:timestamp",
    IMAGE_VIEW = "/image/boardId/:boardId/seed/:seed/timestamp/:timestamp",
    IMAGE_VIEW_QUERY = "/image/boardId/:boardId/seed/:seed/timestamp/:timestamp/:query",
}