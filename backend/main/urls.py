from django.urls import path

from main.views import ForgotUsernameView, CreateResumeView, GetUpdateDeleteResumeView, GetUpdateDeleteVacancyView, \
    CreateVacancyView, SearchVacancyView, CreateFeedbackView, DeleteFeedbackView, GetFeedbacksView, GetVacancies, \
    GetUserFeedbacksView, GetResumeView

urlpatterns = [
    path('auth/users/forgot_username/', ForgotUsernameView.as_view(), name='forgot_username'),

    path('resume/create/', CreateResumeView.as_view(), name='create_resume'),
    path('resume/', GetUpdateDeleteResumeView.as_view(), name='edit_resume'),
    path('resume/<int:pk>/', GetResumeView.as_view(), name='get_resume'),

    path('vacancy/create/', CreateVacancyView.as_view(), name='create_vacancy'),
    path('vacancy/<int:pk>/', GetUpdateDeleteVacancyView.as_view(), name='edit_vacancy'),
    path('vacancy/search/', SearchVacancyView.as_view(), name='search_vacancy'),
    path('vacancy/', GetVacancies.as_view(), name='get_vacancies'),

    path('feedback/create/', CreateFeedbackView.as_view(), name='create_feedback'),
    path('feedback/', GetFeedbacksView.as_view(), name='get_feedback'),
    path('feedback/user/', GetUserFeedbacksView.as_view(), name='get_user_feedback'),
    path('feedback/delete/<int:pk>/', DeleteFeedbackView.as_view(), name='delete_feedback'),
]
