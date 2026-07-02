from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationListView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = (permissions.AllowAny,)
    
    def get_queryset(self):
        return Application.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = (permissions.AllowAny,)