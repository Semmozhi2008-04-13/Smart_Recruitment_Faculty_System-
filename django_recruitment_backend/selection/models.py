from django.db import models
from django.conf import settings
from candidates.models import Candidate
from jobs.models import Job

class Selection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('on_hold', 'On Hold'),
    )
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='selections')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='selections')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    rank_position = models.IntegerField(null=True, blank=True)
    selection_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.status}"
