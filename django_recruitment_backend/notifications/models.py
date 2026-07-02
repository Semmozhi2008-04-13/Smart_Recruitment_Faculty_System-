from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = (
        ('application', 'Application'),
        ('interview', 'Interview'),
        ('evaluation', 'Evaluation'),
        ('selection', 'Selection'),
        ('offer', 'Offer'),
        ('system', 'System'),
    )
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
