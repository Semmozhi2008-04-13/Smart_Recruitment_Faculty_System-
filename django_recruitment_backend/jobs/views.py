from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer

class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'department', 'is_active']
    search_fields = ['title', 'description', 'specialization']
    ordering_fields = ['created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = (permissions.AllowAny,)
    
    def perform_update(self, serializer):
        serializer.save()