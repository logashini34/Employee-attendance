export interface ApiMessage {
    code: string;       // short, machine-friendly code (e.g. "USER_ALREADY_EXISTS")
    statusCode: number; // HTTP status code
    message: string;    // human-friendly message
}

export const ValidationMessages = {
    REQUIRED_FIELDS: {
        code: "VALIDATION_REQUIRED_FIELDS",
        statusCode: 400,
        message: "Name, email, password and employeeId are required.",
    },
    LOGIN_FIELDS: {
        code: "VALIDATION_LOGIN_FIELDS",
        statusCode: 400,
        message: "Email and password are required.",
    },
    INVALID_ID_PARAM: {
        code: "INVALID_ID_PARAM",
        statusCode: 400,
        message: "The provided ID is not a valid ObjectId.",
    },
} as const;

export const AuthMessages = {
    MANAGER_REGISTRATION_FORBIDDEN: {
        code: "MANAGER_REGISTRATION_FORBIDDEN",
        statusCode: 403,
        message: "Managers cannot register via this route.",
    },
    USER_ALREADY_EXISTS: {
        code: "USER_ALREADY_EXISTS",
        statusCode: 400,
        message: "User already exists, try logging in.",
    },
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        statusCode: 404,
        message: "No user found, please register first.",
    },
    CURRENT_USER_NOT_FOUND: {
        code: "CURRENT_USER_NOT_FOUND",
        statusCode: 404,
        message: "User not found.",
    },
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        statusCode: 401,
        message: "Unauthorized.",
    },
    INVALID_CREDENTIALS: {
        code: "INVALID_CREDENTIALS",
        statusCode: 401,
        message: "Incorrect credentials.",
    },
} as const;

export const AttendanceMessages = {
    ATTENDANCE_ALREADY_CHECKED_IN: {
        code: "ATTENDANCE_ALREADY_CHECKED_IN",
        statusCode: 400,
        message: "You have already checked in for today.",
    },
    ATTENDANCE_CHECKIN_REQUIRED: {
        code: "ATTENDANCE_CHECKIN_REQUIRED",
        statusCode: 400,
        message: "You must check in before checking out.",
    },
    ATTENDANCE_ALREADY_CHECKED_OUT: {
        code: "ATTENDANCE_ALREADY_CHECKED_OUT",
        statusCode: 400,
        message: "You have already checked out for today.",
    },
    FORBIDDEN_MANAGER_ONLY: {
        code: "FORBIDDEN_MANAGER_ONLY",
        statusCode: 403,
        message: "Only managers are allowed to access this resource.",
    },

    INVALID_OBJECT_ID: {
        code: "INVALID_OBJECT_ID",
        statusCode: 400,
        message: "The provided id is not a valid ObjectId.",
    },
} as const;

export const CommonMessages = {
    ROUTE_NOT_FOUND: {
        code: "ROUTE_NOT_FOUND",
        statusCode: 404,
        message: "Route not found.",
    },
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
        message: "Something went wrong, please try again.",
    },
} as const;

export const RoleMessages = {
    FORBIDDEN_MANAGER_ONLY: {
        code: "FORBIDDEN_MANAGER_ONLY",
        statusCode: 403,
        message: "This action is restricted to managers.",
    },
} as const;

export const ApiMessages = {
    ...ValidationMessages,
    ...AuthMessages,
    ...AttendanceMessages,
    ...CommonMessages,
    ...RoleMessages
} as const;
