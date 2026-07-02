from django.urls import path
from .views import CandidateListView, CandidateDetailView

urlpatterns = [
    path('', CandidateListView.as_view(), name='candidate-list'),
    path('<int:pk>/', CandidateDetailView.as_view(), name='candidate-detail'),
]
