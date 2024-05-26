from django.urls import path

from main.views import ForgotUsernameView

urlpatterns = [
    path('auth/users/forgot_username/', ForgotUsernameView.as_view(), name='forgot_username'),
]
