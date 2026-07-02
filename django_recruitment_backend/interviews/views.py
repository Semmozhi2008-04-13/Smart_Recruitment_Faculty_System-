from rest_framework import viewsets, permissions
from .models import Interview, InterviewPanel
from .serializers import InterviewSerializer, InterviewPanelSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    permission_classes = (permissions.AllowAny,)

class InterviewPanelViewSet(viewsets.ModelViewSet):
    queryset = InterviewPanel.objects.all()
    serializer_class = InterviewPanelSerializer
    permission_classes = (permissions.AllowAny,)
