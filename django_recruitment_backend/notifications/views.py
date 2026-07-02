from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.AllowAny,)
    
    def get_queryset(self):
        return Notification.objects.all()

class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = (permissions.AllowAny,)
