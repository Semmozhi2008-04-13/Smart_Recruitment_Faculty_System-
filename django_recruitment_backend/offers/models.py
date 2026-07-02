from django.db import models
from django.conf import settings
from candidates.models import Candidate
from jobs.models import Job

class Offer(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    )
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='offers')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='offers')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Offer Details
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    joining_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    
    # Terms
    probation_period = models.IntegerField(default=6)  # in months
    benefits = models.TextField(blank=True)
    terms = models.TextField(blank=True)
    
    # Tracking
    offer_letter_sent = models.BooleanField(default=False)
    offer_letter_date = models.DateField(null=True, blank=True)
    response_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.status}"
