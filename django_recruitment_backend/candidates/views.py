from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Candidate
from .serializers import CandidateSerializer

class CandidateListView(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['first_name', 'last_name', 'email', 'specialization']
    ordering_fields = ['ai_ats_score', 'applied_date']

class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = (permissions.AllowAny,)
