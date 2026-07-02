from django.db import models
from django.conf import settings
from candidates.models import Candidate
from jobs.models import Job

class Evaluation(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='evaluations')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Scores
    technical_score = models.FloatField(default=0)
    communication_score = models.FloatField(default=0)
    research_score = models.FloatField(default=0)
    teaching_score = models.FloatField(default=0)
    overall_score = models.FloatField(default=0)
    
    # Feedback
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    recommendation = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.overall_score}"
