from django.utils.translation import gettext_lazy as _


class Messages:
    INVALID_CREDENTIALS_ERROR = _("Невозможно войти с предоставленными учетными данными.")
    INACTIVE_ACCOUNT_ERROR = _("Учетная запись пользователя не активна.")
    INVALID_TOKEN_ERROR = _("Неверный токен для данного пользователя.")
    INVALID_UID_ERROR = _("Неверный ID пользователя или пользователь не существует.")
    STALE_TOKEN_ERROR = _("Устаревший токен для данного пользователя.")
    PASSWORD_MISMATCH_ERROR = _("Пароли не совпадают.")
    USERNAME_MISMATCH_ERROR = _("Имена пользователя не совпадают.")
    INVALID_PASSWORD_ERROR = _("Неверный пароль.")
    EMAIL_NOT_FOUND = _("Пользователь с таким E-mail не существует.")
    CANNOT_CREATE_USER_ERROR = _("Невозможно создать аккаунт.")
